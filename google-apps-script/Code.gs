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
  var salt = props.getProperty("ADMIN_SALT");
  var expected = props.getProperty("ADMIN_HASH");
  var configuredUsername = props.getProperty("ADMIN_USERNAME");

  var cache = CacheService.getScriptCache();
  var failKey = "login_fail:" + hash_(username);
  var failures = Number(cache.get(failKey) || 0);

  if (failures >= 5) {
    return {
      ok: false,
      code: "UNAUTHORIZED",
      message: "พยายามเข้าสู่ระบบหลายครั้งเกินไป กรุณารอ 15 นาที"
    };
  }

  if (!salt || !expected || !configuredUsername ||
      username !== configuredUsername ||
      passwordHash_(salt + password) !== expected) {
    cache.put(failKey, String(failures + 1), 900);
    Utilities.sleep(500);
    return {
      ok: false,
      code: "UNAUTHORIZED",
      message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"
    };
  }

  cache.remove(failKey);
  var token = Utilities.getUuid() + Utilities.getUuid();
  cache.put("admin:" + token, username, 21600);

  return {
    ok: true,
    token: token,
    username: username,
    expiresIn: 21600
  };
}

function adminValidateSession_(input) {
  var username = requireAdmin_(input.token);
  if (!username) {
    return {
      ok: false,
      code: "UNAUTHORIZED",
      message: "เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่"
    };
  }
  return { ok: true, username: username, expiresIn: 21600 };
}

function adminLogout_(input) {
  if (typeof input.token === "string" && input.token.length <= 200) {
    CacheService.getScriptCache().remove("admin:" + input.token);
  }
  return { ok: true };
}

function requireAdmin_(token) {
  if (typeof token !== "string" || token.length > 200) return "";
  return CacheService.getScriptCache().get("admin:" + token) || "";
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
 * Run only for first-time credential setup or an intentional password reset.
 * Existing ADMIN_USERNAME / ADMIN_SALT / ADMIN_HASH values remain valid.
 * Script Properties required: INITIAL_ADMIN_USERNAME and INITIAL_ADMIN_PASSWORD
 * Password must be at least 12 characters.
 */
function initializeAdminCredentials() {
  var props = PropertiesService.getScriptProperties();
  var username = props.getProperty("INITIAL_ADMIN_USERNAME");
  var password = props.getProperty("INITIAL_ADMIN_PASSWORD");

  if (!username || !password || password.length < 12) {
    throw new Error("กำหนด INITIAL_ADMIN_USERNAME และรหัสผ่านอย่างน้อย 12 ตัวอักษรก่อน");
  }

  var salt = Utilities.getUuid() + Utilities.getUuid();
  props.setProperties({
    ADMIN_USERNAME: username,
    ADMIN_SALT: salt,
    ADMIN_HASH: passwordHash_(salt + password)
  });
  props.deleteProperty("INITIAL_ADMIN_USERNAME");
  props.deleteProperty("INITIAL_ADMIN_PASSWORD");
  Logger.log("Admin credentials initialized. Plaintext setup values removed.");
}
