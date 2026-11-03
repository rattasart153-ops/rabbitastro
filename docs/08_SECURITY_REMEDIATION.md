# 08 — Security Remediation: Four Risk Areas

วันที่ดำเนินการ: 2026-11-04  
Branch: rabbitastro-sandbox  
Source baseline: index branch commit da06441acbc3456f6feb33cbe5a415cfe1399eb9  
ไฟล์ที่แก้: index (1).html  
สถานะ: Code changes committed; static syntax check passed; Browser/runtime tests not run

## ขอบเขต

ดำเนินการแก้ 4 จุดตามลำดับจาก Data Flow Trace โดยคงสูตรคำนวณ ชุดคำทำนาย และข้อความเดิมไว้ ไม่ได้เปลี่ยน logic การคำนวณหรือข้อมูลคำทำนาย

## 1. Error Handler — แก้แล้ว

- เพิ่ม escapeHTML() สำหรับ escape &, <, >, double quote และ single quote
- Escape ข้อความจาก err.message ก่อนนำไปประกอบ HTML ใน Main และ Oreguram error handlers
- Tarot/Rune error path ยังคง escape ข้อความก่อน render และส่งผ่าน sanitizer กลางอีกชั้น
- Error templates ถูกส่งผ่าน setSafeHTML() ซึ่งตรวจ allowlist ก่อนลง DOM

ผล: error string ไม่สามารถสร้าง tag หรือ attribute จากข้อความที่ส่งเข้ามาได้ในเส้นทางที่แก้

## 2. Prediction Renderer — แก้แล้ว

- เพิ่ม sanitizeHTML() และ setSafeHTML()
- เปลี่ยนจุดแสดงผล dynamic HTML ของ Person, Tarot/Rune, God และ Oreguram ให้ผ่าน sanitizer กลาง
- เปลี่ยน shared subconscious voice renderer ให้ผ่าน sanitizer
- Sanitizer ใช้ allowlist ของ HTML tags, attributes, href protocols และ CSS properties
- ลบ script/style/iframe/object/embed/svg/math/form/input/button และ tag ที่ไม่อนุญาตตาม policy
- ลบ event-handler attributes และ attributes ที่ไม่ได้อยู่ใน allowlist
- href จำกัดเป็น http(s), mailto, tel, fragment และ relative path ที่ไม่ใช่ protocol-relative URL
- CSS จำกัด property ที่อนุญาตและปฏิเสธ url(), expression, javascript:, @import, behavior, binding และอักขระที่ใช้ breakout

ผล: ข้อมูลจาก prediction datasets และ Engine result objects ผ่าน sanitization ก่อนถูกใส่ใน results DOM

## 3. Shared HTML Helpers — แก้แล้ว

- tileHtml() sanitize key/value/description fragments ก่อนประกอบ
- elementTag() escape ข้อความและจำกัดตัวอักษรของ class token
- listHtml() รับเฉพาะ Array และ sanitize แต่ละรายการ
- stepsHtml() รับเฉพาะ Array, จำกัด CSS color format และ sanitize ข้อความแต่ละขั้น
- luckyChipsHtml() sanitize chip content

ผล: helper กลางไม่ปล่อย markup ที่ไม่ผ่าน allowlist ไปยัง renderer ชั้นบน

## 4. RHD Data — แก้แล้ว

- Freeze ชุดคำถาม RHD และ array ย่อยที่เปิดเผยผ่าน window.RHD_SELF_QUESTIONS
- Renderer ตรวจว่า source เป็น object และ candidate เป็น Array จริง
- ใช้ own-property lookup, รับเฉพาะ string, จำกัด 2 ข้อ และตัดความยาวต่อข้อไม่เกิน 300 ตัวอักษร
- Escape คำถามก่อนนำไปต่อ HTML
- เปลี่ยน subconscious presentation panel ใน script แยกให้ใช้ createElement() และ textContent แทน innerHTML

ผล: RHD question data มี validation/immutability เพิ่มขึ้น และข้อความสะท้อนใจใน panel ถูกแสดงเป็น text node

## 5. Static Verification

- ดึง Source Code จาก branch หลัง commit
- ตรวจ inline script ทั้ง 6 blocks ด้วย JavaScript parser (compile-only ผ่าน new Function; ไม่ execute)
- ผล: ทั้ง 6 scripts ผ่าน syntax compilation
- ตรวจ innerHTML assignments: จุด dynamic result rendering ถูกเปลี่ยนเป็น setSafeHTML(); ที่เหลือเป็นการ clear string ว่างหรือเป็น implementation ภายใน setSafeHTML()
- ตรวจว่า RHD question renderer ใช้ validation และ escapeHTML
- ตรวจว่า panel ใน script แยกไม่มี panel.innerHTML แล้ว

ข้อจำกัด: syntax compilation ไม่ใช่ Browser runtime test, ไม่ได้ execute DOM APIs, ไม่ได้ทดสอบ payload ใน browser และไม่ได้พิสูจน์ว่าไม่มี XSS ทุกชนิด

## 6. Regression / Runtime Tests ที่ยังค้าง

ต้องทดสอบใน Browser จริง:
1. payload <img src=x onerror=alert(1)> ในทุก field ที่เกี่ยวข้อง
2. payload <svg onload=alert(1)> และ attribute breakout
3. Error object ที่มี markup ใน message สำหรับทุก Engine
4. Oreguram prediction/question/deep data ที่มี markup-like text
5. RHD_SELF_QUESTIONS ถูกแก้เป็น object ผิดชนิด, string แทน array, array มี non-string และข้อความยาว
6. ตรวจ CTA link ว่ายังเปิด LINE ได้ตามเดิม
7. ตรวจรูปแบบ/สี/spacing ของ Person, God, Oreguram, Tarot/Rune และ RHD
8. ตรวจ console errors และ behavior หลังคำนวณซ้ำ

## 7. ข้อจำกัดและความเสี่ยงคงเหลือ

- Sanitizer เป็น allowlist สำหรับ markup ที่ระบบสร้าง ไม่ใช่การรับรองความปลอดภัยของ DOM ทั้งเว็บไซต์
- ยังต้องตรวจ sinks ในส่วนอื่นของเว็บไซต์ที่ไม่ใช่ result renderers และตรวจ third-party/browser extensions ตาม threat model
- Browser DOMParser behavior และ rendering compatibility ยังไม่ได้ทดสอบ
- หาก DOMParser ไม่พร้อมใช้งาน sanitizer จะ fallback เป็น escaped text ซึ่งปลอดภัยกว่าแต่ markup จะไม่แสดงรูปแบบเดิม

## 8. สิ่งที่ไม่ได้เปลี่ยน

- สูตรคำนวณและชุดคำทำนาย
- ข้อความคำทำนายเดิม
- UI flow และการเลือกแท็บ/หมวด/คำถาม
- Branch index และ main
- ไม่มีการ merge

## 9. Follow-up Static Regression Checks (2026-11-04)

### Step 1 — XSS payload encoding
- ทดสอบ escapeHTML() กับ payload 7 แบบ: img/onerror, svg/onload, script tag, javascript: link, quote/attribute breakout, HTML entity input และ iframe/srcdoc
- ผล: 7/7 ถูก encode โดยไม่มี literal angle brackets หรือ quote characters เหลือใน output
- ขอบเขต: เป็น unit check ของ HTML encoding เท่านั้น ไม่ใช่ DOM/browser exploit test

### Step 2 — Error Handler encoding
- ทดสอบ error.message 4 กรณี รวม markup-like error strings และข้อความปกติ
- ผล: 4/4 ถูก encode ก่อนประกอบ error markup
- Static source inspection พบ Main และ Oreguram ใช้ escapeHTML(); Tarot/Rune escape special HTML characters ก่อนส่งเข้า setSafeHTML()

### Step 3 — Prediction Renderer routing
- ตรวจ source ของ renderPersonResult, renderGodResult, renderOreguramResult และ renderTarotRuneStandaloneResult
- ทั้ง 4 renderer มีเส้นทางส่งผลลัพธ์ผ่าน setSafeHTML(resultsBox, ...)
- ตรวจ assignment innerHTML ทั้งไฟล์: เหลือการ clear ด้วย string ว่างและ assignment ภายใน setSafeHTML() เท่านั้น ไม่พบการ assign dynamic result string ตรง ๆ จาก renderer

### Step 4 — CTA link protocol
- ตรวจ allowlist URL pattern ด้วยชุด URL 10 แบบ
- อนุญาต https/http, mailto, tel, fragment และ relative path; ปฏิเสธ protocol-relative URL, javascript:, data: และ vbscript:
- LINE CTA ใช้ https://lin.ee/6Jwz5RD ซึ่งอยู่ใน allowlist
- ยังไม่ได้คลิก CTA ใน Browser จริง

### Step 5 — Browser visual/interaction regression
- Blocked / Not Run: ไม่มี Browser automation หรือ live DOM runtime ในสภาพแวดล้อมการตรวจครั้งนี้
- ต้องทดสอบหน้าตา, การคำนวณ, CTA click, tab switching, repeated calculation และ browser console บน deployed preview ก่อนอนุมัติ release
