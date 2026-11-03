# 07 — Data Flow Trace

วันที่ตรวจ: 2026-11-04  
Source branch: index  
Source commit: da06441acbc3456f6feb33cbe5a415cfe1399eb9  
วิธีตรวจ: Static inspection จาก Source Code เต็มไฟล์  
Runtime/Browser: Not Run

## 1. เป้าหมาย

ติดตามข้อมูลจากฟอร์มและ Local Storage ผ่านฟังก์ชันคำนวณไปยัง renderer และ HTML sinks เพื่อแยกการสะท้อนข้อมูลผู้ใช้โดยตรงออกจากการเลือกข้อความในชุดข้อมูลภายใน

นี่เป็น Static Trace ไม่ใช่ Dynamic Taint Analysis และยังไม่ยืนยัน exploitability ใน Browser

## 2. Sources — แหล่งข้อมูล

### S-01 ชื่อและนามสกุล
- ช่อง: fName, fLast
- อ่านโดย readSharedInputs() แถวประมาณ 4941–4950
- ส่งต่อไปยัง Engine.calcPerson(), Engine.calcGod(), Engine.calcOreguram()
- calcNameNumber() ลบช่องว่าง รวมค่าตัวอักษร ลดเป็นเลข 1–9 แล้วเลือก NAME_PREDICTIONS ตามเลข
- ไม่พบการนำ raw ชื่อหรือนามสกุลไปต่อใน HTML renderer หลักที่ตรวจ

Trace: ชื่อ → เลขศาสตร์ → เลือก prediction record ภายใน ไม่ใช่ raw-name reflection

### S-02 วัน เดือน ปี และเวลาเกิด
- ช่อง: bDay, bMonth, bYear, bHour, bMin, noBirthTime
- readSharedInputs() อ่านค่าและ Engine.readBirthInput() แปลงค่าตัวเลขด้วย parseInt
- ค่าที่ได้ใช้คำนวณรหัสพื้นดวง พลังวันเกิด จิตสำนึก ลัคนา ไพ่ รูน และการเลือกชุดคำทำนาย
- isSharedComplete() ตรวจเพียงว่ามีค่า ไม่ได้ตรวจวันปฏิทินจริงทุกโมดูล
- Tarot/Rune standalone มีการตรวจวันเกิดและช่วงเวลาเพิ่มเติม แต่ไม่ได้เป็น validation กลางของทุก Engine

Trace: form → parse ตัวเลข → สูตร → รหัส/lookup ข้อมูลภายใน ไม่พบ raw date/time string ถูกต่อเข้า HTML โดยตรงใน renderer หลักที่ตรวจ

### S-03 คำถามโอเรกุรัม
- ช่อง: oreguramQuestion
- อ่านค่าและ parseInt เป็น question ID
- ตรวจว่า ID มีอยู่ใน Engine.OREGURAM_QUESTIONS หรือไม่ หากไม่พบใช้ข้อแรก
- calcOreguram() เลือก object คำถามจาก array ภายใน Source

Trace: การเลือกจาก UI → integer ID → static question object ไม่พบ free-text question ใน flow นี้

### S-04 ตัวเลือกหมวด/หัวข้อ/โหมด
- category มาจาก data-cat ของ chip ในหน้า
- subTopicKey มาจาก keys ของ SHORT_CATEGORIES
- mode/view มาจาก data-mode และ data-view ของ UI
- ใช้เป็น key เลือกข้อมูลและฟังก์ชัน ไม่พบ arbitrary free text จากผู้ใช้ในเส้นทางนี้

### S-05 Local Storage
- key: horakratai_form_state_v1
- เก็บ field ใน sharedForm และ oreguramQuestion
- restore กลับเป็น input.value หรือ checkbox.checked
- ไม่พบการส่ง string จาก Local Storage ตรงเข้า innerHTML ใน handler นี้
- Local Storage ไม่ใช่ security boundary เพราะผู้ใช้หรือ JavaScript ใน origin เดียวกันแก้ค่าได้

Trace: Local Storage → form values → input flow ข้างต้น

## 3. เส้นทางหลักไปยัง Renderer

### 3.1 Person Engine
sharedForm → readSharedInputs() → showResultFor() → renderPersonResult() → Engine.calcPerson() → section renderer → resultsBox.innerHTML

ผลคำนวณประกอบด้วยรหัส ตัวเลข และ reference ไปยัง prediction datasets เช่น baseDeep/topicPred ข้อความส่วนใหญ่ถูกเลือกจากข้อมูลภายในตามเลขและ category

จุด sink หลักประมาณบรรทัด 6313

### 3.2 God Engine
sharedForm → renderGodResult() → Engine.calcGod()/Engine.calcPerson() และ RHD lookup → resultsBox.innerHTML

เลขเทพและเลขกระต่ายคำนวณจากข้อมูลฟอร์ม จากนั้นเลือกข้อความจาก map และชุดข้อมูล RHD ที่ประกาศใน Source Code

จุด sink หลักประมาณบรรทัด 6571

### 3.3 Oreguram
sharedForm + oreguramQuestion → renderOreguramResult() → Engine.calcOreguram() → question/prediction/deep datasets → warmOreguramText() → HTML string → resultsBox.innerHTML

question ID ถูกจำกัดให้เป็น ID ที่มีใน array ภายใน ส่วนคำถาม คำตอบ และรายละเอียดมาจาก datasets ภายในตาม question ID, category และ R4

warmOreguramText() ปรับสำนวนข้อความเท่านั้น ไม่ได้ทำ HTML escaping

จุด sink หลักประมาณบรรทัด 6655

### 3.4 Tarot/Rune
sharedForm → renderTarotRuneStandaloneResult() → Engine.calcPerson(feature tarotRune) → card/rune/crystal lookup → renderTarotRuneSection() → resultsBox.innerHTML

ผลลัพธ์หลักมาจากชุดข้อมูลไพ่ รูน และคริสตัลภายใน Source Code
Fallback renderer มี helper escape สำหรับชื่อไพ่/รูน/คริสตัล แต่ detailed renderer ใช้ string concatenation กับ fields ของ result object โดยตรง

จุด sink หลักประมาณบรรทัด 6366

## 4. HTML Sink Inventory

| ตำแหน่งโดยประมาณ | ข้อมูลที่นำเข้า | ข้อสังเกต |
|---|---|---|
| 6313 Person | titleText และ body | body ผ่าน section renderers และ helper |
| 6366 Tarot/Rune | body และ CTA | fields จาก card/rune/crystal data |
| 6571 God | HTML string h | map ข้อความและ RHD lookup |
| 6655 Oreguram | HTML string h | prediction/deep data; warmOreguramText ไม่ escape |
| 6401 Main error | err.message | ไม่มี escaping |
| 6679 Oreguram error | err.message | ไม่มี escaping |
| 6418 Tarot/Rune error | safeError | escape ก่อนประกอบ HTML |
| 6248–6253 Shared voice | เลขกระต่ายและ voice map | เลขถูก parse/range check; ข้อความเป็น map ภายใน |
| 6009–6013 RHD | hd/rabbit/data fields | ต้องยืนยัน provenance ของ datasets |

การกำหนด innerHTML เป็น string ว่างเพื่อเคลียร์ผลลัพธ์ไม่ใช่ data injection sink

## 5. ผลการประเมิน Data Flow

### ยืนยันได้จาก Source
1. Renderer หลายจุดประกอบ HTML จาก dynamic values โดยไม่มี escaping ที่จุดใช้งาน
2. warmOreguramText() ไม่ใช่ sanitizer
3. Error message ใน main และ Oreguram catch ถูกนำไปประกอบ HTML โดยตรง
4. helper เช่น tileHtml(), listHtml(), stepsHtml() ไม่ escape argument ภายใน helper
5. Local Storage restore กลับไปยัง form fields ไม่ได้เขียน HTML โดยตรง
6. คำถามโอเรกุรัมใช้ ID ที่ตรวจ membership กับ array ไม่ใช่ข้อความอิสระ

### ยังไม่พบในเส้นทางปกติที่ตรวจ
- raw ชื่อ/นามสกุลถูกสะท้อนเข้า HTML โดยตรง
- raw วัน/เดือน/ปี/เวลา ถูกสะท้อนเข้า HTML โดยตรง
- Local Storage string ถูกส่งตรงเข้า innerHTML
- free-text user prompt ในช่องคำถามโอเรกุรัม

### ยังยืนยันไม่ได้
- มี attacker-controlled value ไปถึง sink ได้จริงใน Browser หรือไม่
- script อื่นสามารถแก้ Engine datasets หรือ global objects ได้หรือไม่
- datasets ทุกชุดที่ renderer ใช้เป็น static literals ทั้งหมดหรือไม่
- exception ทุกกรณีมีข้อความที่ผู้ใช้ควบคุมได้หรือไม่
- มี exploitable DOM XSS จริงหรือไม่

**คำตัดสิน:** จาก flow ปกติที่ตรวจ ความเสี่ยงหลักอยู่ที่ unsafe rendering ของข้อมูลภายใน/ผลคำนวณและ error objects มากกว่าการสะท้อน raw form input โดยตรง ยังไม่ยืนยัน DOM XSS ที่โจมตีผ่านฟอร์มได้จริง

## 6. แนวทางแก้ที่ควรทำก่อน

1. แสดง error ด้วย textContent หรือ helper escape ที่ทดสอบแล้ว
2. กำหนด contract ว่าข้อความต้อง escape ส่วน class/style/attribute ต้อง allowlist
3. เพิ่ม escape helper กลางพร้อม unit tests สำหรับอักขระพิเศษ HTML
4. ตรวจ helper tileHtml/listHtml/stepsHtml/elementTag และ renderer ทุก Engine
5. ยืนยัน data provenance ของ Engine.RHD, window.RHD_SELF_QUESTIONS และ prediction datasets
6. เพิ่ม regression tests เพื่อยืนยันว่าคำทำนายและหน้าตาเดิมไม่เปลี่ยน

## 7. Runtime tests ที่ยังจำเป็น

- ทดสอบชื่อที่มีอักขระคล้าย HTML ว่าถูกแปลงเป็นเลขเท่านั้นและไม่ถูก render
- ทดสอบวันที่/เวลา/ตัวเลขผิดรูปแบบทุก Engine
- ทดสอบ Local Storage tampering และ malformed JSON
- จำลอง error message ที่มี markup-like text ใน error handlers
- ตรวจทุก HTML sink ด้วยค่าที่ควบคุมได้จริง
- บันทึก Browser, URL, commit, console output และผลทดสอบ

## 8. ขอบเขตการเปลี่ยนแปลง

รอบนี้เป็น read-only ต่อ Source Code ไม่มีการแก้ไข index (1).html ไม่มีการแก้สูตร คำทำนาย หรือ UI เพิ่มเฉพาะเอกสาร Audit บน rabbitastro-sandbox
