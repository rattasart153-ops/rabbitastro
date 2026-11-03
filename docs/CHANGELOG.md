# Changelog

บันทึกการเปลี่ยนแปลงที่สำคัญของ Rabbitastro โดยเรียงจากใหม่ไปเก่า

รูปแบบ:
- Added — เพิ่มความสามารถ/เอกสาร
- Changed — เปลี่ยนพฤติกรรมหรือโครงสร้าง
- Fixed — แก้ข้อผิดพลาด
- Security — การเปลี่ยนแปลงด้านความปลอดภัย
- Audit — ผลการตรวจสอบ
- Notes — ข้อจำกัดหรือข้อมูลประกอบ

## 2026-11-04

### Security
- เพิ่ม escapeHTML() และ sanitizer แบบ allowlist พร้อม setSafeHTML() เพื่อควบคุม dynamic HTML ในผลลัพธ์ของ Person, God, Oreguram, Tarot/Rune และ shared voice
- ปรับ shared HTML helpers ให้ sanitize ข้อความ/fragment, จำกัด CSS color และ class token
- ปรับ Error Handler ให้ escape ข้อความ error ก่อน render
- Freeze RHD question dataset, validate รูปแบบ/ชนิด/จำนวน/ความยาวข้อมูล และเปลี่ยน subconscious panel เป็น DOM createElement/textContent
- เพิ่ม `docs/08_SECURITY_REMEDIATION.md`; สูตรคำนวณและชุดคำทำนายไม่เปลี่ยน
- Static JavaScript syntax check ผ่านครบ 6 inline scripts; Browser/runtime/payload tests ยัง Not Run


### Audit
- เพิ่มรายงาน Data Flow Trace รอบที่ 5 ครอบคลุมข้อมูลฟอร์ม การคำนวณ การเลือกชุดคำทำนาย และจุดแสดงผล
- ไม่พบการสะท้อนข้อมูลชื่อและวันเกิดดิบโดยตรงในเส้นทางหลักที่ตรวจ แต่ยังมีจุดประกอบ HTML และข้อความข้อผิดพลาดที่ควรปรับปรุง
- การตรวจครั้งนี้เป็น Static Review ไม่มีการแก้ไข Source Code และยังไม่ได้ทดสอบ Runtime

### Audit
- ทำ XSS Deep Inspection รอบที่ 4 จาก Source เต็ม พบ unsafe HTML construction หลายกลุ่ม, warmOreguramText ไม่ได้ escape และ error message บางเส้นทางถูกต่อเข้า innerHTML
- เพิ่มรายงาน `docs/06_AUDIT4_XSS_DEEP_INSPECTION.md` และ Test Cases XSS-01 ถึง XSS-07
- ยังไม่ยืนยัน exploitable DOM XSS เนื่องจากยังไม่ได้ทำ Browser payload test และ complete taint verification

### Audit
- ทำ Static Security Review รอบที่ 3: พบ dynamic HTML sinks ที่ต้อง trace ต่อ, Local Storage ที่เก็บข้อมูลฟอร์ม, validation ที่ไม่สม่ำเสมอ และ error handling ที่ต้องตรวจเพิ่ม
- บันทึกข้อค้นพบและ Test Cases RT-01 ถึง RT-12 ใน `docs/05_AUDIT3_STATIC_SECURITY.md`
- Runtime/Browser Test และการยืนยัน XSS exploitability ยังไม่ได้รัน

### Added
- สร้างโครงสร้างเอกสาร Markdown เริ่มต้นบน Branch `rabbitastro-sandbox`
- เพิ่ม README และเอกสารภาพรวมโครงการ
- เพิ่ม System Specification baseline จาก Source Code
- เพิ่ม Source Code Audit และรายการความเสี่ยง V-01 ถึง V-07
- เพิ่ม Development Status และ Test Plan

### Notes
- เอกสารอ้างอิง Source Code จาก Branch `index` ณ Commit `da06441acbc3456f6feb33cbe5a415cfe1399eb9`
- ไม่มีการแก้ไขหรือลบ Source Code ต้นฉบับ
- ยังไม่มี Runtime/Browser Test หรือ Security Test ที่ยืนยันว่าผ่าน
- Branch `main` และ `index` ไม่ได้ถูกแก้ไขในงานเอกสารชุดนี้

## ก่อนวันที่ 2026-11-04

### Audit
- ดำเนินการ Reverse Engineering รอบที่ 1
- ดำเนินการ Verification รอบที่ 2 จาก Source Code
- บันทึกข้อค้นพบและความเสี่ยงในเอกสาร Source Code Audit
