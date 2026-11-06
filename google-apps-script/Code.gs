const SHEET_NAME = "Bookings";
const HEADERS = ["bookingId","createdAt","customerName","phone","lineId","service","bookingDate","bookingTime","note","status","updatedAt","updatedBy"];

function doPost(e) {
  try {
    const input = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    let result;
    switch (input.action) {
      case "createBooking": result = createBooking(input.booking || {}); break;
      case "adminLogin": result = adminLogin(input); break;
      case "adminListBookings": result = adminListBookings(input); break;
      case "adminUpdateBooking": result = adminUpdateBooking(input); break;
      default: result = { ok:false, message:"คำสั่งไม่ถูกต้อง" };
    }
    return json_(result);
  } catch (err) {
    return json_({ ok:false, message:"เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่" });
  }
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}

function sheet_() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty("BOOKING_SHEET_ID");
  let ss = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.create("Rabbitastro Booking Data");
  if (!id) props.setProperty("BOOKING_SHEET_ID", ss.getId());
  let sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
  }
  return sh;
}

function createBooking(b) {
  const name = clean_(b.name, 100), phone = clean_(b.phone, 30);
  const lineId = clean_(b.lineId, 80), service = clean_(b.service, 100);
  const date = clean_(b.date, 10), time = clean_(b.time, 5), note = clean_(b.note, 1000);
  if (!name || !phone || !service || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    return { ok:false, message:"กรุณากรอกชื่อ เบอร์โทร บริการ วันที่ และเวลาให้ครบถ้วน" };
  }
  if (b.website) return { ok:false, message:"ไม่สามารถรับรายการนี้ได้" };
  const selected = new Date(date + "T" + time + ":00+07:00");
  if (isNaN(selected.getTime()) || selected.getTime() < Date.now() - 60000) return { ok:false, message:"วันและเวลาที่เลือกต้องเป็นเวลาในอนาคต" };
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sh = sheet_(), rows = sh.getDataRange().getValues();
    const occupied = rows.slice(1).some(r => String(r[6]) === date && String(r[7]) === time && ["รอตรวจสอบ","ยืนยันแล้ว"].includes(String(r[9])));
    if (occupied) return { ok:false, code:"SLOT_TAKEN", message:"ช่วงเวลานี้มีผู้จองแล้ว กรุณาเลือกเวลาอื่น" };
    const id = "RAB-" + Utilities.getUuid().replace(/-/g,"").slice(0,10).toUpperCase();
    const now = new Date();
    sh.appendRow([id,now,sheetText_(name),sheetText_(phone),sheetText_(lineId),sheetText_(service),date,time,sheetText_(note),"รอตรวจสอบ",now,""]);
    return { ok:true, bookingId:id, status:"รอตรวจสอบ", message:"ส่งคำขอจองคิวเรียบร้อยแล้ว กรุณารอผู้ดูแลยืนยันคิว" };
  } finally {
    lock.releaseLock();
  }
}

function adminLogin(input) {
  const props = PropertiesService.getScriptProperties();
  const username = clean_(input.username,80), password = String(input.password || "");
  const salt = props.getProperty("ADMIN_SALT"), expected = props.getProperty("ADMIN_HASH");
  if (!salt || !expected || username !== props.getProperty("ADMIN_USERNAME") || hash_(salt + password) !== expected) {
    Utilities.sleep(700);
    return { ok:false, code:"UNAUTHORIZED", message:"ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" };
  }
  const token = Utilities.getUuid() + Utilities.getUuid();
  CacheService.getScriptCache().put("admin:" + token, username, 21600);
  return { ok:true, token:token, username:username, expiresIn:21600 };
}

function requireAdmin_(token) {
  if (typeof token !== "string" || token.length > 200) return "";
  return CacheService.getScriptCache().get("admin:" + token) || "";
}

function adminListBookings(input) {
  const user = requireAdmin_(input.token);
  if (!user) return { ok:false, code:"UNAUTHORIZED", message:"เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่" };
  const sh = sheet_(), values = sh.getDataRange().getValues();
  const bookings = values.slice(1).reverse().map(r => ({
    bookingId:String(r[0]), createdAt:dateText_(r[1]), name:String(r[2]), phone:String(r[3]),
    lineId:String(r[4]), service:String(r[5]), date:String(r[6]), time:String(r[7]),
    note:String(r[8]), status:String(r[9]), updatedAt:dateText_(r[10]), updatedBy:String(r[11])
  }));
  return { ok:true, bookings:bookings };
}

function adminUpdateBooking(input) {
  const user = requireAdmin_(input.token);
  if (!user) return { ok:false, code:"UNAUTHORIZED", message:"เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่" };
  const id = clean_(input.bookingId,40), status = clean_(input.status,30);
  if (!id || !["รอตรวจสอบ","ยืนยันแล้ว","เสร็จสิ้น","ยกเลิก"].includes(status)) return { ok:false, message:"ข้อมูลสถานะไม่ถูกต้อง" };
  const lock = LockService.getScriptLock(); lock.waitLock(15000);
  try {
    const sh = sheet_(), values = sh.getDataRange().getValues();
    for (let i=1;i<values.length;i++) if (String(values[i][0]) === id) {
      sh.getRange(i+1,10).setValue(status);
      sh.getRange(i+1,11).setValue(new Date());
      sh.getRange(i+1,12).setValue(user);
      return { ok:true, message:"อัปเดตสถานะแล้ว" };
    }
    return { ok:false, message:"ไม่พบรายการจองนี้" };
  } finally { lock.releaseLock(); }
}

function sheetText_(value) {\n  const text = String(value == null ? "" : value);\n  return /^[=+@\\-\\t\\r]/.test(text) ? "'" + text : text;\n}\nfunction clean_(value, max) {
  return String(value == null ? "" : value).replace(/[\u0000-\u001f\u007f]/g," ").trim().slice(0,max);
}
function hash_(value) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value, Utilities.Charset.UTF_8);
  return bytes.map(b => ("0" + ((b + 256) % 256).toString(16)).slice(-2)).join("");
}
function dateText_(value) {
  return value instanceof Date ? Utilities.formatDate(value,"Asia/Bangkok","yyyy-MM-dd HH:mm") : String(value || "");
}

// ตั้ง Script Properties ก่อนรันฟังก์ชันนี้หนึ่งครั้ง:
// INITIAL_ADMIN_USERNAME และ INITIAL_ADMIN_PASSWORD
// ฟังก์ชันจะเก็บเฉพาะ SHA-256 hash + salt และลบค่าเริ่มต้นที่เป็น plaintext
function initializeAdminCredentials() {
  const props = PropertiesService.getScriptProperties();
  const username = props.getProperty("INITIAL_ADMIN_USERNAME");
  const password = props.getProperty("INITIAL_ADMIN_PASSWORD");
  if (!username || !password || password.length < 12) throw new Error("กำหนด INITIAL_ADMIN_USERNAME และรหัสผ่านอย่างน้อย 12 ตัวอักษรก่อน");
  const salt = Utilities.getUuid() + Utilities.getUuid();
  props.setProperties({ADMIN_USERNAME:username, ADMIN_SALT:salt, ADMIN_HASH:hash_(salt + password)});
  props.deleteProperty("INITIAL_ADMIN_USERNAME");
  props.deleteProperty("INITIAL_ADMIN_PASSWORD");
}

// เรียกหนึ่งครั้งหลังวางโค้ด เพื่อสร้าง Google Sheet และเก็บ Sheet ID ใน Script Properties
function initializeBookingSheet() {
  const sh = sheet_();
  Logger.log("Booking sheet initialized: " + sh.getParent().getUrl());
}