/**
 * Rabbitastro Admin Authentication API
 * Auth-only endpoint. No booking, queue, or Google Sheets functionality.
 */
function doPost(e) {
  try {
    var input = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    var result;
    switch (input.action) {
      case "adminLogin":
        result = adminLogin_(input);
        break;
      case "adminValidateSession":
        result = adminValidateSession_(input);
        break;
      case "adminLogout":
        result = adminLogout_(input);
        break;
      case "adminSetCredentials":
        result = adminSetCredentials_(input);
        break;
      default:
        result = { ok: false, message: "คำสั่งไม่ถูกต้อง" };
    }
    return json_(result);
  } catch (err) {
    return json_({ ok: false, message: "เกิดข้อผิดพลาดในระบบยืนยันตัวตน กรุณาลองใหม่" });
  }
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}

function adminLogin_(input) {
  var props = PropertiesService.getScriptProperties();
  var username = clean_(input.username, 80);
  var password = String(input.password || "");
  var accounts = [
    { role: "full", username: props.getProperty("FULL_ADMIN_USERNAME"), salt: props.getProperty("FULL_ADMIN_SALT"), hash: props.getProperty("FULL_ADMIN_HASH") },
    { role: "readonly", username: props.getProperty("READONLY_ADMIN_USERNAME"), salt: props.getProperty("READONLY_ADMIN_SALT"), hash: props.getProperty("READONLY_ADMIN_HASH") }
  ];
  // Backward-compatible migration window: the existing account remains Full Admin
  // until initializeAdminAccounts() is run with both new accounts.
  if (!accounts[0].username && props.getProperty("ADMIN_USERNAME")) {
    accounts[0] = { role: "full", username: props.getProperty("ADMIN_USERNAME"), salt: props.getProperty("ADMIN_SALT"), hash: props.getProperty("ADMIN_HASH") };
  }
  var cache = CacheService.getScriptCache();
  var failKey = "login_fail:" + hash_(username);
  var failures = Number(cache.get(failKey) || 0);
  if (failures >= 5) return { ok:false, code:"UNAUTHORIZED", message:"พยายามเข้าสู่ระบบหลายครั้งเกินไป กรุณารอ 15 นาที" };
  var matched = accounts.filter(function (account) {
    return account.username && account.salt && account.hash &&
      username === account.username && passwordHash_(account.salt + password) === account.hash;
  })[0];
  if (!matched) {
    cache.put(failKey, String(failures + 1), 900);
    Utilities.sleep(500);
    return { ok:false, code:"UNAUTHORIZED", message:"ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" };
  }
  cache.remove(failKey);
  var token = Utilities.getUuid() + Utilities.getUuid();
  var authEpoch = props.getProperty("ADMIN_AUTH_EPOCH") || "legacy";
  cache.put("admin:" + token, JSON.stringify({ username: matched.username, role: matched.role, epoch:authEpoch }), 21600);
  return { ok:true, token:token, username:matched.username, role:matched.role, expiresIn:21600 };
}

function adminValidateSession_(input) {
  var session = requireAdminSession_(input.token);
  if (!session) return { ok:false, code:"UNAUTHORIZED", message:"เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่" };
  return { ok:true, username:session.username, role:session.role, expiresIn:21600 };
}

function adminLogout_(input) {
  if (typeof input.token === "string" && input.token.length <= 200) CacheService.getScriptCache().remove("admin:" + input.token);
  return { ok:true };
}

function adminSetCredentials_(input) {
  var actor = requireFullAdmin_(input.token);
  if (!actor) return { ok:false, code:"FORBIDDEN", message:"บัญชีนี้ไม่มีสิทธิ์จัดการบัญชี Admin" };
  var fullUser = clean_(input.fullUsername, 80);
  var fullPass = String(input.fullPassword || "");
  var readUser = clean_(input.readonlyUsername, 80);
  var readPass = String(input.readonlyPassword || "");
  if (!fullUser || !readUser || fullUser === readUser || fullPass.length < 12 || readPass.length < 12 || fullPass.length > 256 || readPass.length > 256 || fullPass === readPass) {
    return { ok:false, message:"กรุณากำหนดชื่อผู้ใช้ต่างกัน และรหัสผ่านทั้งสองชุดอย่างน้อย 12 ตัวอักษร โดยรหัสผ่านต้องไม่เหมือนกัน" };
  }
  var fullSalt = Utilities.getUuid() + Utilities.getUuid();
  var readSalt = Utilities.getUuid() + Utilities.getUuid();
  var props = PropertiesService.getScriptProperties();
  props.setProperties({
    FULL_ADMIN_USERNAME:fullUser, FULL_ADMIN_SALT:fullSalt, FULL_ADMIN_HASH:passwordHash_(fullSalt + fullPass),
    READONLY_ADMIN_USERNAME:readUser, READONLY_ADMIN_SALT:readSalt, READONLY_ADMIN_HASH:passwordHash_(readSalt + readPass),
    ADMIN_AUTH_EPOCH:Utilities.getUuid()
  });
  return { ok:true, message:"เปลี่ยนบัญชี Admin ทั้งสองชุดแล้ว กรุณาเข้าสู่ระบบใหม่" };
}

function requireAdminSession_(token) {
  if (typeof token !== "string" || token.length > 200) return null;
  var stored = CacheService.getScriptCache().get("admin:" + token);
  if (!stored) return null;
  try {
    var parsed = JSON.parse(stored);
    if (parsed && parsed.username && (parsed.role === "full" || parsed.role === "readonly")) {
      var currentEpoch = PropertiesService.getScriptProperties().getProperty("ADMIN_AUTH_EPOCH") || "legacy";
      return parsed.epoch === currentEpoch ? parsed : null;
    }
  } catch (ignore) {
    // Existing sessions are accepted only before the two-account migration is configured.
  }
  var epoch = PropertiesService.getScriptProperties().getProperty("ADMIN_AUTH_EPOCH") || "legacy";
  return epoch === "legacy" ? { username: stored, role: "full", epoch:"legacy" } : null;
}

function requireAdmin_(token) {
  var session = requireAdminSession_(token);
  return session ? session.username : "";
}

function requireFullAdmin_(token) {
  var session = requireAdminSession_(token);
  return session && session.role === "full" ? session : null;
}

function clean_(value, maxLength) {
  return String(value == null ? "" : value)
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .trim()
    .slice(0, maxLength);
}

function passwordHash_(value) {
  var result = value;
  for (var i = 0; i < 12000; i++) result = hash_(result);
  return result;
}

function hash_(value) {
  var bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    value,
    Utilities.Charset.UTF_8
  );
  return bytes.map(function (b) {
    return ("0" + ((b + 256) % 256).toString(16)).slice(-2);
  }).join("");
}

/**
 * Initialize the two Admin accounts from Script Properties.
 * Required: INITIAL_FULL_ADMIN_USERNAME, INITIAL_FULL_ADMIN_PASSWORD,
 * INITIAL_READONLY_ADMIN_USERNAME, INITIAL_READONLY_ADMIN_PASSWORD.
 * Both passwords must be at least 12 characters.
 */
function initializeAdminAccounts() {
  var props = PropertiesService.getScriptProperties();
  var fullUser = clean_(props.getProperty("INITIAL_FULL_ADMIN_USERNAME"), 80);
  var fullPass = String(props.getProperty("INITIAL_FULL_ADMIN_PASSWORD") || "");
  var readUser = clean_(props.getProperty("INITIAL_READONLY_ADMIN_USERNAME"), 80);
  var readPass = String(props.getProperty("INITIAL_READONLY_ADMIN_PASSWORD") || "");
  if (!fullUser || !readUser || fullUser === readUser || fullPass.length < 12 || readPass.length < 12 || fullPass === readPass) {
    throw new Error("กำหนดบัญชี Full Admin และ Read-Only Admin ให้ครบ ใช้ชื่อผู้ใช้ต่างกัน และรหัสผ่านอย่างน้อย 12 ตัวอักษร");
  }
  var fullSalt = Utilities.getUuid() + Utilities.getUuid();
  var readSalt = Utilities.getUuid() + Utilities.getUuid();
  props.setProperties({
    FULL_ADMIN_USERNAME: fullUser, FULL_ADMIN_SALT: fullSalt, FULL_ADMIN_HASH: passwordHash_(fullSalt + fullPass),
    READONLY_ADMIN_USERNAME: readUser, READONLY_ADMIN_SALT: readSalt, READONLY_ADMIN_HASH: passwordHash_(readSalt + readPass),
    ADMIN_AUTH_EPOCH: Utilities.getUuid()
  });
  ["INITIAL_FULL_ADMIN_USERNAME","INITIAL_FULL_ADMIN_PASSWORD","INITIAL_READONLY_ADMIN_USERNAME","INITIAL_READONLY_ADMIN_PASSWORD",
   "ADMIN_USERNAME","ADMIN_SALT","ADMIN_HASH","INITIAL_ADMIN_USERNAME","INITIAL_ADMIN_PASSWORD"].forEach(function(key){ props.deleteProperty(key); });
  Logger.log("Full Admin and Read-Only Admin accounts initialized. Plaintext setup values removed.");
}

/** Legacy entry point intentionally disabled after migration to two accounts. */
function initializeAdminCredentials() {
  throw new Error("ใช้ initializeAdminAccounts() เพื่อกำหนดบัญชี Admin ทั้ง 2 บัญชี");
}
