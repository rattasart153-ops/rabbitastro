# 03 — Development Status

อัปเดตล่าสุด: 2026-11-04  
Branch ทำงาน: `rabbitastro-sandbox`

## 1. สถานะภาพรวม

| งาน | สถานะ | หมายเหตุ |
|---|---|---|
| สร้าง Branch ทดลอง | เสร็จแล้ว | สร้างจาก Commit ของ `index` |
| ตรวจ Source Code เบื้องต้น | เสร็จแล้ว | อ่าน Source Code |
| Reverse Engineering สูตรหลัก | เบื้องต้นเสร็จ | ยังมีรายละเอียดต้องยืนยัน |
| ตรวจระบบคำทำนาย | เบื้องต้นเสร็จ | ต้องทดสอบ Runtime |
| ตรวจ Local Storage | Source review แล้ว | ยังไม่ทดสอบ Browser |
| Runtime/Browser test | Not Run | ยังไม่ได้เปิดเว็บไซต์ใน Browser; ต้องรัน RT-01 ถึง RT-12 และ XSS-01 ถึง XSS-07 |
| Static Security Review | เบื้องต้นเสร็จ | Audit 3–5 และ remediation รอบ 6; Browser payload tests ยังไม่รัน |
| Security Remediation | Source changes เสร็จ | แก้ Error Handler, Prediction Renderer, HTML Helpers และ RHD data บน Sandbox; syntax check ผ่าน 6 scripts |
| Automated regression tests | ยังไม่เริ่ม | ต้องออกแบบ golden cases |
| เอกสาร Markdown ชุดเริ่มต้น | เสร็จแล้ว | รวม Audit รอบที่ 3 แบบ Static Review |

## 2. งานที่ทำเสร็จแล้วก่อนเริ่ม Sandbox

- ตรวจ Branch `index` และบันทึก Commit SHA
- ตรวจโครงสร้างไฟล์ พบ `index (1).html` เป็นไฟล์เดียวใน Tree ที่ตรวจ
- ทำ Reverse Engineering รอบที่ 1
- ทำ Verification จาก Source รอบที่ 2
- บันทึกความเสี่ยง V-01 ถึง V-07
- สร้าง Branch `rabbitastro-sandbox` จาก Commit ของ `index`

## 3. งานที่กำลังดำเนินการ

- สร้างโครงสร้างเอกสาร Markdown ให้เป็นแหล่งอ้างอิงกลาง
- แยกข้อเท็จจริงจาก Source Review ออกจากสิ่งที่ยังไม่ได้ทดสอบจริง
- เตรียมแผน Runtime และ Security Verification

## 4. Next Actions ที่แนะนำ

### P0 — ความถูกต้องและความปลอดภัยพื้นฐาน

1. ตรวจ validation ของวัน/เดือน/ปีและเวลาในทุกโมดูล
2. รัน Browser payload tests XSS-01 ถึง XSS-07 และ regression ของ UI หลัง Security Remediation
3. ตรวจ Local Storage ว่าบันทึกข้อมูลใดบ้างและล้างได้อย่างไร
4. ตรวจ error handling เมื่อข้อมูลไม่ครบ/ผิดรูปแบบ

### P1 — ความถูกต้องของสูตร

1. สร้างชุด input/output อ้างอิงสำหรับสูตรพื้นดวง
2. ตรวจสูตรโอเรกุรัมแยกจาก topicCodeOf
3. ตรวจ edge cases วันพุธและเวลาเกิดที่ไม่ทราบ
4. ตรวจการเปลี่ยนวัน/เดือน/ปีและเขตเวลา

### P2 — คุณภาพการใช้งาน

1. ทดสอบ responsive layout
2. ทดสอบการกู้คืนข้อมูลหลัง reload
3. ทดสอบ Browser หลักและอุปกรณ์มือถือ/แท็บเล็ต
4. ตรวจ accessibility และข้อความ error

## 5. กติกาการอัปเดตสถานะ

- เปลี่ยนสถานะเป็น Done ได้เมื่อมีหลักฐานการทำงานหรือผลตรวจที่ตรวจซ้ำได้
- งานที่ตรวจจาก Source อย่างเดียวให้ระบุว่า Source Reviewed ไม่ใช่ Tested
- ทุกการเปลี่ยนแปลงต้องเพิ่มรายการใน Changelog
- ระบุ Commit SHA ที่เกี่ยวข้องเมื่อมีการส่งมอบงาน
- หากพบข้อขัดแย้งระหว่างเอกสารกับ Source ให้บันทึกเป็น issue ก่อนแก้ไข

## 6. ประวัติการตรวจสอบ

| รอบ | วิธี | สถานะ |
|---|---|---|
| Audit 1 | Reverse Engineering จาก Source | เสร็จ |
| Audit 2 | ตรวจสูตร/ตัวอย่างจาก Source | เสร็จ |
| Audit 3 | Static Security Review | เบื้องต้นเสร็จ; Runtime/Browser ยัง Not Run |
| Audit 4 | XSS Deep Inspection | Static review เสร็จ; exploitability และ runtime ยังไม่ยืนยัน |
| Audit 5 | Data Flow Trace | Trace เส้นทาง form → Engine → renderer → HTML sink แล้ว; runtime ยัง Not Run |
| Audit 6 | Security Remediation | แก้ 4 กลุ่มเสี่ยงแล้ว; JavaScript syntax check ผ่าน 6 scripts; Browser/runtime ยัง Not Run |
