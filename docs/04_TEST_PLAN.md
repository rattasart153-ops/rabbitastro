# 04 — Test Plan

## 1. วัตถุประสงค์

กำหนดแนวทางทดสอบ Rabbitastro ให้สามารถตรวจซ้ำได้ โดยไม่เปลี่ยนพฤติกรรมเดิมโดยไม่ตั้งใจ

## 2. สถานะปัจจุบัน

ยังไม่มีผล Runtime/Browser Test ที่ยืนยันในเอกสารนี้ การตรวจที่ผ่านมาเป็น Source Review และการคำนวณตัวอย่างตามสูตรเท่านั้น

## 3. Test Suites

### TS-01 — Input Validation

- ชื่อว่าง/มีช่องว่าง/อักขระพิเศษ
- นามสกุลว่างและมีค่า
- วันเกิดถูกต้องและไม่ถูกต้อง
- วันที่ 29 กุมภาพันธ์ในปีอธิกสุรทินและปีปกติ
- เดือน 1–12 และค่าหลุดช่วง
- ปี พ.ศ./ค.ศ. ตามรูปแบบที่ระบบรองรับ
- เวลา 00:00, 23:59 และค่าหลุดช่วง
- ไม่ทราบเวลาเกิด
- ข้อมูลไม่ครบและชนิดข้อมูลผิด

### TS-02 — Calculation Regression

ต้องบันทึก input และ expected output จาก Source เดิมก่อนเปลี่ยนสูตร:
- เลขศาสตร์ไทย/อังกฤษ
- reduce1
- R1/J/BaseCode
- ลัคนาตามช่วงเวลา
- RHD 81 คู่
- เลขเทพประจำตัว
- โอเรกุรัม 100 ข้อ
- topicCodeOf แยกจากสูตรโอเรกุรัม
- ไพ่ Major 21 / Minor 56
- Rune 24
- personal/daily crystal

### TS-03 — Prediction Selection

- หมวดการงาน การเงิน สุขภาพ ความรัก เรื่องที่สนใจ และเรื่องอื่น ๆ
- รายวัน/ราย 7 วัน/ราย 3 เดือน
- วันเปลี่ยนผ่านเดือนและปี
- เงื่อนไขวันพุธก่อน/หลัง 18:00
- เวลา 12:00 ที่ใช้กับราย 7 วัน
- กรณีไม่ทราบเวลาเกิด

### TS-04 — Persistence

- บันทึก Local Storage เมื่อกรอกข้อมูล
- Reload แล้วกู้คืนข้อมูล
- ข้อมูลเดิมเสียหายหรือ JSON parse ไม่ได้
- schema เปลี่ยนเวอร์ชัน
- ล้างข้อมูลและเริ่มต้นใหม่
- ตรวจว่ามีข้อมูลส่วนบุคคลใดถูกบันทึกบ้าง

### TS-05 — Security

- ตรวจการใช้ innerHTML/outerHTML/insertAdjacentHTML
- ตรวจการ escape ข้อมูลผู้ใช้และข้อมูลคำทำนาย
- ตรวจ URL และ external links
- ตรวจการใช้ eval หรือ dynamic code execution หากมี
- ตรวจ event handlers และ MutationObserver
- ตรวจการรั่วไหลของข้อมูลผ่าน console/URL/storage

### TS-06 — Browser & Responsive

- Desktop viewport
- Mobile viewport
- Tablet viewport
- Browser ที่รองรับตามเป้าหมายโครงการ
- การสลับแท็บและการแสดงผลหลังกรอกข้อมูล
- การใช้งานด้วย keyboard และ screen reader เบื้องต้น

## 4. รูปแบบการบันทึก Test Case

| Field | ความหมาย |
|---|---|
| Test ID | รหัสทดสอบ |
| Preconditions | เงื่อนไขก่อนเริ่ม |
| Input | ข้อมูลที่ใช้ |
| Steps | ขั้นตอน |
| Expected | ผลที่คาดหวัง |
| Actual | ผลที่เกิดจริง |
| Evidence | ภาพ/Log/Output |
| Result | Pass / Fail / Blocked / Not Run |
| Commit | Commit ที่ทดสอบ |

## 5. เกณฑ์ผ่าน

- ผลจริงตรงกับ Expected
- ไม่มี error ที่ทำให้ flow หลักหยุดทำงาน
- ไม่มี regression ในกรณีอ้างอิงเดิม
- ผลทดสอบทำซ้ำได้
- บันทึก Browser/Environment และ Commit ที่ใช้ทดสอบ

ห้ามใช้คำว่า Pass หากไม่มีผล Actual และหลักฐานประกอบ
