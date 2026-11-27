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
      case "predictionRuntime":
        result = predictionRuntime_();
        break;
      case "predictionInitialize":
      case "predictionList":
      case "predictionSave":
      case "predictionDelete":
      case "predictionPublish":
      case "predictionHistory":
      case "predictionRollback":
        result = predictionAction_(input);
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
  cache.put("admin:" + token, JSON.stringify({ username: matched.username, role: matched.role }), 21600);
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

function requireAdminSession_(token) {
  if (typeof token !== "string" || token.length > 200) return null;
  var stored = CacheService.getScriptCache().get("admin:" + token);
  if (!stored) return null;
  try {
    var parsed = JSON.parse(stored);
    if (parsed && parsed.username && (parsed.role === "full" || parsed.role === "readonly")) return parsed;
  } catch (ignore) {
    // Existing sessions created before role support are treated as Full Admin.
  }
  return { username: stored, role: "full" };
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
    READONLY_ADMIN_USERNAME: readUser, READONLY_ADMIN_SALT: readSalt, READONLY_ADMIN_HASH: passwordHash_(readSalt + readPass)
  });
  ["INITIAL_FULL_ADMIN_USERNAME","INITIAL_FULL_ADMIN_PASSWORD","INITIAL_READONLY_ADMIN_USERNAME","INITIAL_READONLY_ADMIN_PASSWORD",
   "ADMIN_USERNAME","ADMIN_SALT","ADMIN_HASH","INITIAL_ADMIN_USERNAME","INITIAL_ADMIN_PASSWORD"].forEach(function(key){ props.deleteProperty(key); });
  Logger.log("Full Admin and Read-Only Admin accounts initialized. Plaintext setup values removed.");
}

/** Legacy entry point intentionally disabled after migration to two accounts. */
function initializeAdminCredentials() {
  throw new Error("ใช้ initializeAdminAccounts() เพื่อกำหนดบัญชี Admin ทั้ง 2 บัญชี");
}


/* ============================================================
 * CENTRAL PREDICTION REPOSITORY
 * Uses the existing Apps Script deployment and Admin session.
 * Spreadsheet is created only after an authenticated Admin
 * explicitly runs predictionInitialize from the dashboard.
 * ============================================================ */

var PREDICTION_SHEETS_ = {
  Engines: ["engine1", "engine2", "engine3", "engine4"],
  Categories: [],
  Topics: [],
  Variables: [],
  Predictions: [],
  Rules: [],
  Mappings: [],
  Versions: [],
  Audit_Logs: []
};
var PREDICTION_HEADERS_ = [
  "id", "engineId", "parentId", "name", "title", "description",
  "content", "dataJson", "priority", "status", "version",
  "sortOrder", "createdAt", "updatedAt", "updatedBy"
];
var PREDICTION_COLLECTIONS_ = [
  "Engines", "Features", "Categories", "Topics", "Variables",
  "Predictions", "Rules", "Mappings"
];

function predictionAction_(input) {
  var session = requireFullAdmin_(input.token);
  if (!session) return { ok: false, code: "FORBIDDEN", message: "บัญชีนี้ไม่มีสิทธิ์จัดการระบบ" };
  var actor = session.username;
  try {
    if (input.action === "predictionInitialize") return predictionInitialize_(actor);
    if (input.action === "predictionList") return predictionList_(input);
    if (input.action === "predictionSave") return predictionSave_(input, actor);
    if (input.action === "predictionDelete") return predictionDelete_(input, actor);
    if (input.action === "predictionPublish") return predictionPublish_(input, actor);
    if (input.action === "predictionHistory") return predictionHistory_(input);
    if (input.action === "predictionRollback") return predictionRollback_(input, actor);
    return { ok: false, message: "คำสั่งจัดการคำทำนายไม่ถูกต้อง" };
  } catch (err) {
    console.error("Prediction repository error: " + err.message);
    return { ok: false, code: "PREDICTION_ERROR", message: "ไม่สามารถดำเนินการกับคลังคำทำนายได้ กรุณาตรวจสอบการตั้งค่าและลองใหม่" };
  }
}

function predictionSpreadsheet_() {
  var id = PropertiesService.getScriptProperties().getProperty("PREDICTION_SPREADSHEET_ID");
  if (!id) throw new Error("PREDICTION_STORE_NOT_INITIALIZED");
  return SpreadsheetApp.openById(id);
}

function predictionInitialize_(actor) {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty("PREDICTION_SPREADSHEET_ID");
  var ss = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.create("Rabbitastro Prediction Repository");
  Object.keys(PREDICTION_SHEETS_).forEach(function (name) {
    var sheet = ss.getSheetByName(name) || ss.insertSheet(name);
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, PREDICTION_HEADERS_.length).setValues([PREDICTION_HEADERS_]);
      sheet.setFrozenRows(1);
    } else {
      var existing = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
      if (existing.join("|") !== PREDICTION_HEADERS_.join("|")) {
        throw new Error("SCHEMA_MISMATCH_" + name);
      }
    }
  });
  if (!id) props.setProperty("PREDICTION_SPREADSHEET_ID", ss.getId());
  var featureSheet = ss.getSheetByName("Features");
  if (featureSheet.getLastRow() === 1) {
    var featureRows = [
      ["engine1-natal","engine1","","พื้นดวงกำเนิด","พื้นดวงกำเนิด","","",JSON.stringify({key:"natal",group:"base"}),100,"active",1,10,new Date().toISOString(),new Date().toISOString(),actor],
      ["engine1-asc","engine1","","ลัคนาราศี","ลัคนาราศี","","",JSON.stringify({key:"asc",group:"base"}),100,"active",1,20,new Date().toISOString(),new Date().toISOString(),actor],
      ["engine1-rhd","engine1","","RHD","RHD","","",JSON.stringify({key:"rhd",group:"base"}),100,"active",1,30,new Date().toISOString(),new Date().toISOString(),actor],
      ["engine1-short","engine1","","ภาพรวมของเรื่อง","ภาพรวมของเรื่อง","","",JSON.stringify({key:"short",group:"topic"}),100,"active",1,40,new Date().toISOString(),new Date().toISOString(),actor],
      ["engine1-month","engine1","","รายเดือน","รายเดือน","","",JSON.stringify({key:"month",group:"topic"}),100,"active",1,50,new Date().toISOString(),new Date().toISOString(),actor],
      ["engine2-default","engine2","","เทพประจำตัว","เทพประจำตัว","","",JSON.stringify({key:"default"}),100,"active",1,10,new Date().toISOString(),new Date().toISOString(),actor],
      ["engine3-default","engine3","","โอเรกุรัม","โอเรกุรัม","","",JSON.stringify({key:"default"}),100,"active",1,10,new Date().toISOString(),new Date().toISOString(),actor],
      ["engine4-default","engine4","","ไพ่ทาโรต์ + รูน","ไพ่ทาโรต์ + รูน","","",JSON.stringify({key:"default"}),100,"active",1,10,new Date().toISOString(),new Date().toISOString(),actor]
    ];
    featureSheet.getRange(2,1,featureRows.length,PREDICTION_HEADERS_.length).setValues(featureRows);
  }
  var engineSheet = ss.getSheetByName("Engines");
  if (engineSheet.getLastRow() === 1) {
    var now = new Date().toISOString();
    var rows = [
      ["engine1", "engine1", "", "Engine 1", "ดวงบุคคล", "โหรกระต่ายและ Matrix Destiny", "", JSON.stringify({ key: "person" }), 10, "active", 1, 10, now, now, actor],
      ["engine2", "engine2", "", "Engine 2", "เทพประจำตัว", "คงแนวทางคำทำนายเดิม", "", JSON.stringify({ key: "god" }), 20, "active", 1, 20, now, now, actor],
      ["engine3", "engine3", "", "Engine 3", "โอเรกุรัม", "ระบบคำทำนายโอเรกุรัม", "", JSON.stringify({ key: "oreguram" }), 30, "active", 1, 30, now, now, actor],
      ["engine4", "engine4", "", "Engine 4", "ไพ่ทาโรต์ + รูน", "ระบบไพ่ทาโรต์และรูน", "", JSON.stringify({ key: "tarot-rune" }), 40, "active", 1, 40, now, now, actor]
    ];
    engineSheet.getRange(2, 1, rows.length, PREDICTION_HEADERS_.length).setValues(rows);
  }
  predictionAudit_(ss, "initialize", "Repository", ss.getId(), null, { spreadsheetId: ss.getId() }, actor);
  return { ok: true, spreadsheetId: ss.getId(), spreadsheetName: ss.getName(), collections: PREDICTION_COLLECTIONS_ };
}

function predictionList_(input) {
  var collection = String(input.collection || "");
  predictionAssertCollection_(collection);
  var ss = predictionSpreadsheet_();
  var sheet = ss.getSheetByName(collection);
  if (!sheet || sheet.getLastRow() < 2) return { ok: true, collection: collection, records: [] };
  var values = sheet.getRange(2, 1, sheet.getLastRow() - 1, PREDICTION_HEADERS_.length).getValues();
  var records = values.map(function (row) {
    var data = {};
    try { data = JSON.parse(row[7] || "{}"); } catch (ignore) {}
    return {
      id: String(row[0]), engineId: String(row[1]), parentId: String(row[2]),
      name: String(row[3]), title: String(row[4]), description: String(row[5]),
      content: String(row[6]), data: data, priority: Number(row[8] || 0),
      status: String(row[9]), version: Number(row[10] || 1),
      sortOrder: Number(row[11] || 0), createdAt: String(row[12]),
      updatedAt: String(row[13]), updatedBy: String(row[14])
    };
  });
  if (input.engineId) records = records.filter(function (r) { return r.engineId === String(input.engineId); });
  records.sort(function (a, b) { return a.sortOrder - b.sortOrder || a.name.localeCompare(b.name); });
  return { ok: true, collection: collection, records: records };
}

function predictionSave_(input, actor) {
  var collection = String(input.collection || "");
  predictionAssertCollection_(collection);
  var record = input.record;
  if (!record || typeof record !== "object" || Array.isArray(record)) throw new Error("INVALID_RECORD");
  var serialized = JSON.stringify(record);
  if (serialized.length > 45000) throw new Error("RECORD_TOO_LARGE");
  if (collection !== "Engines" && !/^engine[1-4]$/.test(String(record.engineId || ""))) throw new Error("INVALID_ENGINE");
  if (collection === "Rules") predictionValidateRule_(record);
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var ss = predictionSpreadsheet_();
    var sheet = ss.getSheetByName(collection);
    var id = String(record.id || Utilities.getUuid());
    var rowNumber = predictionFindRow_(sheet, id);
    var old = rowNumber ? predictionReadRecord_(sheet, rowNumber) : null;
    var now = new Date().toISOString();
    var version = old ? old.version + 1 : 1;
    var normalized = {
      id: id, engineId: String(record.engineId || ""), parentId: String(record.parentId || ""),
      name: clean_(record.name, 160), title: clean_(record.title, 200),
      description: clean_(record.description, 1000), content: String(record.content || "").slice(0, 40000),
      data: record.data && typeof record.data === "object" && !Array.isArray(record.data) ? record.data : {},
      priority: predictionNumber_(record.priority, 100), status: predictionStatus_(record.status === "published" ? "draft" : record.status),
      version: version, sortOrder: predictionNumber_(record.sortOrder, 100),
      createdAt: old ? old.createdAt : now, updatedAt: now, updatedBy: actor
    };
    if (!normalized.name && !normalized.title) throw new Error("NAME_OR_TITLE_REQUIRED");
    var row = [
      normalized.id, normalized.engineId, normalized.parentId, normalized.name,
      normalized.title, normalized.description, normalized.content,
      JSON.stringify(normalized.data), normalized.priority, normalized.status,
      normalized.version, normalized.sortOrder, normalized.createdAt,
      normalized.updatedAt, normalized.updatedBy
    ];
    if (rowNumber) sheet.getRange(rowNumber, 1, 1, row.length).setValues([row]);
    else sheet.appendRow(row);
    predictionVersion_(ss, collection, id, version, normalized, actor);
    predictionAudit_(ss, old ? "update" : "create", collection, id, old, normalized, actor);
    return { ok: true, record: normalized };
  } finally {
    lock.releaseLock();
  }
}

function predictionDelete_(input, actor) {
  var collection = String(input.collection || "");
  predictionAssertCollection_(collection);
  var id = String(input.id || "");
  if (!id || id.length > 100) throw new Error("INVALID_ID");
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var ss = predictionSpreadsheet_();
    var sheet = ss.getSheetByName(collection);
    var rowNumber = predictionFindRow_(sheet, id);
    if (!rowNumber) return { ok: false, message: "ไม่พบรายการที่ต้องการลบ" };
    var old = predictionReadRecord_(sheet, rowNumber);
    var beforeArchive = JSON.parse(JSON.stringify(old));
    old.status = "archived";
    old.version += 1;
    old.updatedAt = new Date().toISOString();
    old.updatedBy = actor;
    sheet.getRange(rowNumber, 10).setValue("archived");
    sheet.getRange(rowNumber, 11).setValue(old.version);
    sheet.getRange(rowNumber, 14).setValue(old.updatedAt);
    sheet.getRange(rowNumber, 15).setValue(actor);
    predictionVersion_(ss, collection, id, old.version, old, actor);
    predictionAudit_(ss, "archive", collection, id, beforeArchive, old, actor);
    return { ok: true, archived: true, id: id };
  } finally {
    lock.releaseLock();
  }
}

function predictionPublish_(input, actor) {
  var collection = String(input.collection || "");
  predictionAssertCollection_(collection);
  var id = String(input.id || "");
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var ss = predictionSpreadsheet_();
    var sheet = ss.getSheetByName(collection);
    var rowNumber = predictionFindRow_(sheet, id);
    if (!rowNumber) throw new Error("RECORD_NOT_FOUND");
    var record = predictionReadRecord_(sheet, rowNumber);
    if (collection === "Rules") predictionValidateRule_(record, ss);
    if (collection === "Mappings") predictionValidateMapping_(record, ss);
    record.status = "published";
    record.version += 1;
    record.updatedAt = new Date().toISOString();
    record.updatedBy = actor;
    sheet.getRange(rowNumber, 10).setValue("published");
    sheet.getRange(rowNumber, 11).setValue(record.version);
    sheet.getRange(rowNumber, 14).setValue(record.updatedAt);
    sheet.getRange(rowNumber, 15).setValue(actor);
    predictionVersion_(ss, collection, id, record.version, record, actor);
    predictionAudit_(ss, "publish", collection, id, null, record, actor);
    return { ok: true, record: record };
  } finally {
    lock.releaseLock();
  }
}

function predictionValidateRule_(record, ss) {
  var data = record.data || {};
  var conditions = data.conditions;
  if (!Array.isArray(conditions) || !conditions.length || conditions.length > 50) throw new Error("RULE_CONDITIONS_REQUIRED");
  var allowed = ["eq", "neq", "gt", "gte", "lt", "lte", "in", "between", "contains", "exists"];
  conditions.forEach(function (condition) {
    if (!condition || typeof condition.variable !== "string" || !condition.variable || allowed.indexOf(condition.operator) < 0) {
      throw new Error("INVALID_RULE_CONDITION");
    }
  });
  if (data.logic && data.logic !== "AND" && data.logic !== "OR") throw new Error("INVALID_RULE_LOGIC");
  if (!data.predictionId) throw new Error("RULE_PREDICTION_REQUIRED");
  if (ss) {
    var predictionSheet = ss.getSheetByName("Predictions");
    var predictionRow = predictionFindRow_(predictionSheet, String(data.predictionId));
    if (!predictionRow) throw new Error("RULE_TARGET_PREDICTION_NOT_FOUND");
    var target = predictionReadRecord_(predictionSheet, predictionRow);
    if (target.engineId !== record.engineId) throw new Error("RULE_TARGET_ENGINE_MISMATCH");
    if (target.status !== "published") throw new Error("RULE_TARGET_NOT_PUBLISHED");
  }
}

function predictionAssertCollection_(collection) {
  if (PREDICTION_COLLECTIONS_.indexOf(collection) < 0) throw new Error("INVALID_COLLECTION");
}
function predictionNumber_(value, fallback) {
  var n = Number(value);
  return isFinite(n) ? Math.max(-1000000, Math.min(1000000, n)) : fallback;
}
function predictionStatus_(value) {
  var status = String(value || "draft");
  return ["draft", "published", "active", "inactive", "archived"].indexOf(status) >= 0 ? status : "draft";
}
function predictionFindRow_(sheet, id) {
  if (!sheet || sheet.getLastRow() < 2) return 0;
  var found = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1)
    .createTextFinder(id).matchEntireCell(true).findNext();
  return found ? found.getRow() : 0;
}
function predictionReadRecord_(sheet, rowNumber) {
  var row = sheet.getRange(rowNumber, 1, 1, PREDICTION_HEADERS_.length).getValues()[0];
  var data = {};
  try { data = JSON.parse(row[7] || "{}"); } catch (ignore) {}
  return {
    id: String(row[0]), engineId: String(row[1]), parentId: String(row[2]),
    name: String(row[3]), title: String(row[4]), description: String(row[5]),
    content: String(row[6]), data: data, priority: Number(row[8] || 0),
    status: String(row[9]), version: Number(row[10] || 1),
    sortOrder: Number(row[11] || 0), createdAt: String(row[12]),
    updatedAt: String(row[13]), updatedBy: String(row[14])
  };
}
function predictionVersion_(ss, collection, id, version, record, actor) {
  ss.getSheetByName("Versions").appendRow([
    Utilities.getUuid(), "", collection, id, "", "Version " + version, "",
    JSON.stringify({ version: version, record: record }), 0, "saved", version,
    0, new Date().toISOString(), new Date().toISOString(), actor
  ]);
}
function predictionAuditSummary_(value) {
  if (!value) return null;
  return {
    id: value.id || "",
    name: value.name || "",
    title: value.title || "",
    status: value.status || "",
    version: Number(value.version || 0)
  };
}
function predictionAudit_(ss, action, collection, id, beforeValue, afterValue, actor) {
  var now = new Date().toISOString();
  ss.getSheetByName("Audit_Logs").appendRow([
    Utilities.getUuid(), "", collection, id, action, "Audit event", "",
    JSON.stringify({
      before: predictionAuditSummary_(beforeValue),
      after: predictionAuditSummary_(afterValue)
    }), 0, "logged", 1, 0, now, now, actor
  ]);
}


/* Published runtime feed: public by design, but never returns drafts or audit data. */
function predictionRuntime_() {
  try {
    var ss = predictionSpreadsheet_(), output = {};
    ["Engines", "Features", "Categories", "Topics", "Variables", "Predictions", "Rules", "Mappings"].forEach(function (collection) {
      var sheet = ss.getSheetByName(collection);
      if (!sheet || sheet.getLastRow() < 2) { output[collection] = []; return; }
      var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, PREDICTION_HEADERS_.length).getValues();
      output[collection] = rows.map(function (row) {
        var data = {}; try { data = JSON.parse(row[7] || "{}"); } catch (ignore) {}
        return { id:String(row[0]), engineId:String(row[1]), parentId:String(row[2]), name:String(row[3]), title:String(row[4]), description:String(row[5]), content:String(row[6]), data:data, priority:Number(row[8] || 0), status:String(row[9]), version:Number(row[10] || 1), sortOrder:Number(row[11] || 0) };
      }).filter(function (record) {
      if (collection === "Engines" || collection === "Features") return record.status === "active";
      return record.status === "published" || (collection === "Variables" && record.status === "active");
    });
    });
    return { ok:true, runtime:output, publishedAt:new Date().toISOString() };
  } catch (err) { return { ok:false, code:"PREDICTION_STORE_UNAVAILABLE", message:"คลังคำทำนายยังไม่ได้เริ่มต้น" }; }
}

function predictionHistory_(input) {
  var collection=String(input.collection || ""); predictionAssertCollection_(collection);
  var id=String(input.id || ""); if (!id || id.length>100) throw new Error("INVALID_ID");
  var ss=predictionSpreadsheet_(), sheet=ss.getSheetByName("Versions");
  if (!sheet || sheet.getLastRow()<2) return {ok:true,versions:[]};
  var rows=sheet.getRange(2,1,sheet.getLastRow()-1,PREDICTION_HEADERS_.length).getValues(), versions=[];
  rows.forEach(function(row){ if(String(row[2])!==collection || String(row[3])!==id)return; var data={}; try{data=JSON.parse(row[7]||"{}");}catch(ignore){} versions.push({id:String(row[0]),version:Number(data.version||row[10]||1),createdAt:String(row[12]),updatedBy:String(row[14]),record:data.record||null}); });
  versions.sort(function(a,b){return b.version-a.version;}); return {ok:true,versions:versions.slice(0,100)};
}

function predictionRollback_(input, actor) {
  var collection=String(input.collection||""); predictionAssertCollection_(collection);
  var id=String(input.id||""), version=Number(input.version);
  if(!id || !isFinite(version) || version<1) throw new Error("INVALID_ROLLBACK_TARGET");
  var history=predictionHistory_({collection:collection,id:id}).versions;
  var snapshot=history.filter(function(item){return item.version===version;})[0];
  if(!snapshot || !snapshot.record) throw new Error("VERSION_NOT_FOUND");
  var restored=JSON.parse(JSON.stringify(snapshot.record)); restored.id=id;
  var wasPublished=restored.status==="published"; restored.status=wasPublished?"draft":restored.status;
  var saved=predictionSave_({collection:collection,record:restored},actor);
  if(!saved.ok)return saved;
  if(wasPublished)return predictionPublish_({collection:collection,id:id},actor);
  return {ok:true,record:saved.record,rolledBackFrom:version};
}

function predictionValidateMapping_(record, ss) {
  var data = record.data || {};
  if (!data.predictionId) throw new Error("MAPPING_PREDICTION_REQUIRED");
  if (!data.slot && !data.feature && !data.category && !data.topic) throw new Error("MAPPING_SCOPE_REQUIRED");
  var predictionSheet = ss.getSheetByName("Predictions");
  var predictionRow = predictionFindRow_(predictionSheet, String(data.predictionId));
  if (!predictionRow) throw new Error("MAPPING_TARGET_PREDICTION_NOT_FOUND");
  var target = predictionReadRecord_(predictionSheet, predictionRow);
  if (target.engineId !== record.engineId) throw new Error("MAPPING_TARGET_ENGINE_MISMATCH");
  if (target.status !== "published") throw new Error("MAPPING_TARGET_NOT_PUBLISHED");
  if (data.conditions != null) {
    if (!Array.isArray(data.conditions) || !data.conditions.length || data.conditions.length > 50) throw new Error("INVALID_MAPPING_CONDITIONS");
    var allowed = ["eq", "neq", "gt", "gte", "lt", "lte", "in", "between", "contains", "exists"];
    data.conditions.forEach(function (condition) {
      if (!condition || typeof condition.variable !== "string" || !condition.variable || allowed.indexOf(condition.operator) < 0) throw new Error("INVALID_MAPPING_CONDITION");
    });
  }
  if (data.logic && data.logic !== "AND" && data.logic !== "OR") throw new Error("INVALID_MAPPING_LOGIC");
}
