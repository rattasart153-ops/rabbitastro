const SHEET_NAME = "Bookings";
const HEADERS = ["bookingId","createdAt","customerName","phone","lineId","service","bookingDate","bookingTime","note","status","updatedAt","updatedBy","birthDate","birthTime","noBirthTime","consultationCategory","consultationTopic","queueActive","queueOrder"];

function doPost(e) {
  try {
    const input = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    let result;
    switch (input.action) {
      case "createBooking": result = createBooking(input.booking || {}); break;
      case "adminLogin": result = adminLogin(input); break;
      case "adminLogout": result = adminLogout(input); break;
      case "adminListBookings": result = adminListBookings(input); break;
      case "adminUpdateBooking": result = adminUpdateBooking(input); break;
      case "adminManageQueue": result = adminManageQueue(input); break;
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
  } else {
    const existing = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(String);
    HEADERS.forEach(function(header) {
      if (existing.indexOf(header) === -1) {
        sh.getRange(1,sh.getLastColumn()+1).setValue(header);
        existing.push(header);
      }
    });
  }
  return sh;
}

function createBooking(b) {
  const firstName = clean_(b.firstName,60), lastName = clean_(b.lastName,60);
  const name = firstName + " " + lastName, phone = clean_(b.phone,30);
  const lineId = clean_(b.lineId,80), service = clean_(b.service,100);
  const birthDay = Number(b.birthDay), birthMonth = Number(b.birthMonth), birthYear = Number(b.birthYear);
  const birthCheck = new Date(birthYear,birthMonth-1,birthDay);
  const noBirthTime = b.noBirthTime === true;
  const birthHour = noBirthTime ? "" : clean_(b.birthHour,2);
  const birthMinute = noBirthTime ? "" : clean_(b.birthMinute,2);
  const birthDate = birthYear + "-" + String(birthMonth).padStart(2,"0") + "-" + String(birthDay).padStart(2,"0");
  const birthTime = noBirthTime ? "ไม่ทราบเวลาเกิด" : String(birthHour).padStart(2,"0") + ":" + String(birthMinute).padStart(2,"0");
  const category = clean_(b.category,80), topic = clean_(b.topic,120);
  const requiresConsultation = !["โอเรกุรัม","เทพประจำตัว"].includes(service);
  const date = clean_(b.date,10), time = clean_(b.time,5), note = clean_(b.note,1000);
  if (!firstName || !lastName || !phone || !service || (requiresConsultation && (!category || !topic)) ||
      !Number.isInteger(birthDay) || !Number.isInteger(birthMonth) || !Number.isInteger(birthYear) ||
      birthYear < 1900 || birthYear > 2100 || birthCheck.getFullYear() !== birthYear ||
      birthCheck.getMonth() !== birthMonth-1 || birthCheck.getDate() !== birthDay ||
      (!noBirthTime && (!/^(?:[01]\d|2[0-3])$/.test(birthHour) || !/^[0-5]\d$/.test(birthMinute))) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    return { ok:false, message:"กรุณากรอกข้อมูลส่วนตัว วันเกิด บริการ เรื่องที่ปรึกษา และวันเวลาจองให้ครบถ้วน" };
  }
  if (b.website) return { ok:false, message:"ไม่สามารถรับรายการนี้ได้" };
  const selected = new Date(date + "T" + time + ":00+07:00");
  if (isNaN(selected.getTime()) || Utilities.formatDate(selected,"Asia/Bangkok","yyyy-MM-dd HH:mm") !== date + " " + time || selected.getTime() < Date.now() - 60000) return { ok:false, message:"วันและเวลาที่เลือกต้องเป็นวันที่ถูกต้องและอยู่ในอนาคต" };
  const minuteKey = "booking_rate:" + Utilities.formatDate(new Date(),"Asia/Bangkok","yyyyMMddHHmm");
  const cache = CacheService.getScriptCache(), count = Number(cache.get(minuteKey) || 0);
  if (count >= 30) return { ok:false, message:"ขณะนี้มีคำขอจำนวนมาก กรุณารอสักครู่แล้วลองใหม่" };
  cache.put(minuteKey,String(count + 1),120);
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sh = sheet_(), rows = sh.getDataRange().getValues();
    const occupied = rows.slice(1).some(r => String(r[6]) === date && String(r[7]) === time && ["รอตรวจสอบ","ยืนยันแล้ว"].includes(String(r[9])));
    if (occupied) return { ok:false, code:"SLOT_TAKEN", message:"ช่วงเวลานี้มีผู้จองแล้ว กรุณาเลือกเวลาอื่น" };
    const id = "RAB-" + Utilities.getUuid().replace(/-/g,"").slice(0,10).toUpperCase();
    const now = new Date();
    sh.appendRow([id,now,sheetText_(name),sheetText_(phone),sheetText_(lineId),sheetText_(service),date,time,sheetText_(note),"รอตรวจสอบ",now,"",birthDate,birthTime,noBirthTime ? "ใช่" : "ไม่ใช่",sheetText_(category),sheetText_(topic),true,nextQueueOrder_(sh)]);
    return { ok:true, bookingId:id, status:"รอตรวจสอบ", message:"ส่งคำขอจองคิวเรียบร้อยแล้ว กรุณารอผู้ดูแลยืนยันคิว" };
  } finally {
    lock.releaseLock();
  }
}

function adminLogin(input) {
  const props = PropertiesService.getScriptProperties();
  const username = clean_(input.username,80), password = String(input.password || "");
  const salt = props.getProperty("ADMIN_SALT"), expected = props.getProperty("ADMIN_HASH");
  const cache = CacheService.getScriptCache(), failKey = "login_fail:" + hash_(username);
  const failures = Number(cache.get(failKey) || 0);
  if (failures >= 5) return { ok:false, code:"UNAUTHORIZED", message:"พยายามเข้าสู่ระบบหลายครั้งเกินไป กรุณารอ 15 นาที" };
  if (!salt || !expected || username !== props.getProperty("ADMIN_USERNAME") || passwordHash_(salt + password) !== expected) {
    cache.put(failKey,String(failures + 1),900);
    Utilities.sleep(700);
    return { ok:false, code:"UNAUTHORIZED", message:"ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" };
  }
  cache.remove(failKey);
  const token = Utilities.getUuid() + Utilities.getUuid();
  CacheService.getScriptCache().put("admin:" + token, username, 21600);
  return { ok:true, token:token, username:username, expiresIn:21600 };
}

function adminLogout(input) {
  if (typeof input.token === "string") CacheService.getScriptCache().remove("admin:" + input.token);
  return { ok:true };
}

function requireAdmin_(token) {
  if (typeof token !== "string" || token.length > 200) return "";
  return CacheService.getScriptCache().get("admin:" + token) || "";
}

function adminListBookings(input) {
  const user = requireAdmin_(input.token);
  if (!user) return { ok:false, code:"UNAUTHORIZED", message:"เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่" };
  const sh = sheet_(), values = sh.getDataRange().getValues();
  const headers = values[0].map(String);
  const activeCol = headers.indexOf("queueActive");
  const orderCol = headers.indexOf("queueOrder");
  const bookings = values.slice(1).map((r,index) => {
    const status = String(r[9] || "");
    const activeValue = activeCol >= 0 ? r[activeCol] : "";
    const queueActive = activeValue === "" || activeValue == null
      ? !["เสร็จสิ้น","ยกเลิก"].includes(status)
      : activeValue === true || String(activeValue).toLowerCase() === "true";
    return {
      bookingId:String(r[0]), createdAt:dateText_(r[1]), name:String(r[2]), phone:String(r[3]),
      lineId:String(r[4]), service:String(r[5]), date:String(r[6]), time:String(r[7]),
      note:String(r[8]), status:status, updatedAt:dateText_(r[10]), updatedBy:String(r[11]),
      birthDate:String(r[12] || ""), birthTime:String(r[13] || ""), noBirthTime:String(r[14] || ""),
      category:String(r[15] || ""), topic:String(r[16] || ""),
      queueActive:queueActive,
      queueOrder:orderCol >= 0 && Number(r[orderCol]) > 0 ? Number(r[orderCol]) : index + 1
    };
  });
  bookings.sort((a,b) => {
    if (a.queueActive !== b.queueActive) return a.queueActive ? -1 : 1;
    if (a.queueActive && b.queueActive && a.queueOrder !== b.queueOrder) return a.queueOrder - b.queueOrder;
    return b.createdAt.localeCompare(a.createdAt);
  });
  return { ok:true, bookings:bookings };
}

function adminUpdateBooking(input) {
  const user = requireAdmin_(input.token);
  if (!user) return { ok:false, code:"UNAUTHORIZED", message:"เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่" };
  const id = clean_(input.bookingId,40), status = clean_(input.status,30);
  if (!id || !["รอตรวจสอบ","ยืนยันแล้ว","เสร็จสิ้น","ยกเลิก"].includes(status)) return { ok:false, message:"ข้อมูลสถานะไม่ถูกต้อง" };
  const lock = LockService.getScriptLock(); lock.waitLock(15000);
  try {
    const sh = sheet_(), values = sh.getDataRange().getValues(), headers = values[0].map(String);
    const activeCol = headers.indexOf("queueActive") + 1;
    for (let i=1;i<values.length;i++) if (String(values[i][0]) === id) {
      if (status === "ยืนยันแล้ว") {
        const date = String(values[i][6]), time = String(values[i][7]);
        const conflict = values.slice(1).some((row,index) => index !== i-1 && String(row[6]) === date && String(row[7]) === time && ["รอตรวจสอบ","ยืนยันแล้ว"].includes(String(row[9])));
        if (conflict) return { ok:false, code:"SLOT_TAKEN", message:"ไม่สามารถยืนยันได้ เนื่องจากเวลานี้มีรายการจองอื่นอยู่แล้ว" };
      }
      sh.getRange(i+1,10).setValue(status);
      sh.getRange(i+1,11).setValue(new Date());
      sh.getRange(i+1,12).setValue(user);
      if (activeCol > 0) sh.getRange(i+1,activeCol).setValue(!["เสร็จสิ้น","ยกเลิก"].includes(status));
      normalizeQueueOrders_(sh);
      return { ok:true, message:["เสร็จสิ้น","ยกเลิก"].includes(status) ? "อัปเดตสถานะและนำรายการออกจากคิวแล้ว" : "อัปเดตสถานะแล้ว" };
    }
    return { ok:false, message:"ไม่พบรายการจองนี้" };
  } finally { lock.releaseLock(); }
}

function adminManageQueue(input) {
  const user = requireAdmin_(input.token);
  if (!user) return { ok:false, code:"UNAUTHORIZED", message:"เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่" };
  const id = clean_(input.bookingId,40), mode = clean_(input.mode,20);
  if (!id || !["moveUp","moveDown","remove"].includes(mode)) return { ok:false, message:"คำสั่งจัดการคิวไม่ถูกต้อง" };
  const lock = LockService.getScriptLock(); lock.waitLock(15000);
  try {
    const sh = sheet_(), values = sh.getDataRange().getValues(), headers = values[0].map(String);
    const activeCol = headers.indexOf("queueActive") + 1;
    const orderCol = headers.indexOf("queueOrder") + 1;
    if (!activeCol || !orderCol) return { ok:false, message:"ไม่พบข้อมูลลำดับคิว กรุณาอัปเดต Google Apps Script ก่อน" };
    let rowNumber = -1;
    for (let i=1;i<values.length;i++) if (String(values[i][0]) === id) { rowNumber=i+1; break; }
    if (rowNumber < 0) return { ok:false, message:"ไม่พบรายการจองนี้" };
    if (mode === "remove") {
      sh.getRange(rowNumber,activeCol).setValue(false);
      sh.getRange(rowNumber,11).setValue(new Date());
      sh.getRange(rowNumber,12).setValue(user);
      normalizeQueueOrders_(sh);
      return { ok:true, message:"นำรายการออกจากคิวแล้ว โดยเก็บประวัติการจองไว้" };
    }
    const active = [];
    const current = sh.getDataRange().getValues();
    for (let i=1;i<current.length;i++) {
      const status = String(current[i][9] || "");
      const activeValue = current[i][activeCol-1];
      const isActive = (activeValue === "" || activeValue == null) ? !["เสร็จสิ้น","ยกเลิก"].includes(status) : activeValue === true || String(activeValue).toLowerCase() === "true";
      if (isActive) active.push({row:i+1, order:Number(current[i][orderCol-1]) || i+1});
    }
    active.sort((a,b)=>a.order-b.order);
    const index = active.findIndex(x=>x.row===rowNumber);
    if (index < 0) return { ok:false, message:"รายการนี้ถูกนำออกจากคิวแล้ว" };
    const target = mode === "moveUp" ? index-1 : index+1;
    if (target < 0 || target >= active.length) return { ok:true, message:"รายการนี้อยู่ในตำแหน่งสุดทางแล้ว" };
    const temp = active[index]; active[index] = active[target]; active[target] = temp;
    active.forEach((item,i)=>sh.getRange(item.row,orderCol).setValue(i+1));
    sh.getRange(rowNumber,11).setValue(new Date());
    sh.getRange(rowNumber,12).setValue(user);
    return { ok:true, message:"ปรับลำดับคิวแล้ว" };
  } finally { lock.releaseLock(); }
}

function nextQueueOrder_(sh) {
  const values = sh.getDataRange().getValues(), headers = values[0].map(String);
  const activeCol = headers.indexOf("queueActive"), orderCol = headers.indexOf("queueOrder");
  let max = 0;
  for (let i=1;i<values.length;i++) {
    const status = String(values[i][9] || ""), activeValue = activeCol >= 0 ? values[i][activeCol] : "";
    const active = activeValue === "" || activeValue == null ? !["เสร็จสิ้น","ยกเลิก"].includes(status) : activeValue === true || String(activeValue).toLowerCase() === "true";
    if (active && orderCol >= 0) max = Math.max(max,Number(values[i][orderCol]) || 0);
  }
  return max + 1;
}

function normalizeQueueOrders_(sh) {
  const values = sh.getDataRange().getValues(), headers = values[0].map(String);
  const activeCol = headers.indexOf("queueActive"), orderCol = headers.indexOf("queueOrder");
  if (activeCol < 0 || orderCol < 0) return;
  const active = [];
  for (let i=1;i<values.length;i++) {
    const status = String(values[i][9] || ""), value = values[i][activeCol];
    const isActive = value === "" || value == null ? !["เสร็จสิ้น","ยกเลิก"].includes(status) : value === true || String(value).toLowerCase() === "true";
    if (isActive) active.push({row:i+1, order:Number(values[i][orderCol]) || i+1});
  }
  active.sort((a,b)=>a.order-b.order || a.row-b.row);
  active.forEach((item,index)=>sh.getRange(item.row,orderCol+1).setValue(index+1));
}

function sheetText_(value) {
  const text = String(value == null ? "" : value);
  return /^[=+@\\-\\t\\r]/.test(text) ? "'" + text : text;
}
function clean_(value, max) {
  return String(value == null ? "" : value).replace(/[\u0000-\u001f\u007f]/g," ").trim().slice(0,max);
}
function passwordHash_(value) {
  let result = value;
  for (let i=0;i<12000;i++) result = hash_(result);
  return result;
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
  props.setProperties({ADMIN_USERNAME:username, ADMIN_SALT:salt, ADMIN_HASH:passwordHash_(salt + password)});
  props.deleteProperty("INITIAL_ADMIN_USERNAME");
  props.deleteProperty("INITIAL_ADMIN_PASSWORD");
}

// เรียกหนึ่งครั้งหลังวางโค้ด เพื่อสร้าง Google Sheet และเก็บ Sheet ID ใน Script Properties
function initializeBookingSheet() {
  const sh = sheet_();
  Logger.log("Booking sheet initialized: " + sh.getParent().getUrl());
}