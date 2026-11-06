# 06 — Audit รอบที่ 4: XSS Deep Inspection

วันที่ตรวจ: 2026-11-04  
Source branch: `index`  
Source commit: `da06441acbc3456f6feb33cbe5a415cfe1399eb9`  
วิธีตรวจ: Static source inspection จาก Blob เต็มของไฟล์ `index (1).html`

## 1. ขอบเขต

ตรวจทุกตำแหน่งที่พบ `innerHTML` (25 occurrences), helper `warmOreguramText`, helper ประกอบ HTML ที่ใช้ร่วมกัน, renderer หลัก, error renderer, Local Storage และ MutationObserver

ยังไม่ได้เปิด Browser หรือรัน payload จริง จึงไม่จัดอันดับเป็นช่องโหว่ที่ exploit ได้รับการยืนยัน

## 2. ข้อค้นพบสำคัญ

### X4-01 — warmOreguramText ไม่ได้ Escape HTML

**สถานะ:** Confirmed  
**ความเสี่ยง:** สูง หากข้อความต้นทางไม่ใช่ trusted static data

ฟังก์ชัน `warmOreguramText(text)` แปลงข้อความด้วย `modernOreguText` และชุด `String.replace` เพื่อปรับภาษาเท่านั้น ไม่ได้ escape อักขระ HTML เช่น `<`, `>`, `&`, เครื่องหมาย quote

ผลลัพธ์ถูกนำไปต่อ string HTML ใน `renderOreguramResult()` แล้วกำหนดให้ `resultsBox.innerHTML`

ดังนั้น helper นี้ไม่ใช่ sanitizer และไม่ควรถูกเข้าใจว่าเป็นตัวป้องกัน XSS

แหล่งข้อความหลักที่ส่งเข้า helper ได้แก่ questionText, directAnswer, catPrediction.overview/detail/example/advice และ deep.focus/action/caution ต้อง trace ต่อว่าแต่ละค่าเป็นข้อมูลคงที่จาก source ทั้งหมดหรือมีช่องทางรับค่าที่ผู้ใช้/แหล่งภายนอกควบคุมได้

### X4-02 — Oreguram renderer มี HTML sink ที่รับค่าจากผลคำนวณโดยตรง

**สถานะ:** Confirmed  
**ตำแหน่ง:** `renderOreguramResult()` แถวประมาณ 6623–6656

ค่าที่ถูกต่อเข้า HTML โดยตรงและไม่ได้ผ่าน HTML escaping ในจุดนั้น ได้แก่:
- `res.bucketInfo.cls` ใน class attribute
- `res.rabbit.name`
- `res.R4`
- `res.element.name` และ `res.element.symbol`
- `res.pendulumDirection.symbol/name/meaning`
- `res.pendulumDirectionNo`

บางค่ามีแนวโน้มมาจากชุดข้อมูลภายใน แต่ต้องยืนยัน provenance และชนิดข้อมูลก่อนสรุป exploitability โดยเฉพาะค่าที่ถูกใส่ใน attribute ต้อง validate/allowlist แยกจาก text escaping

### X4-03 — Renderer หลักและ helper HTML ใช้ string concatenation จำนวนมาก

**สถานะ:** Confirmed  
**ตำแหน่งตัวอย่าง:** `tileHtml()`, `rabbitTileHtml()`, `nameTileHtml()`, `relationTileHtml()`, `listHtml()`, `stepsHtml()`, `renderPersonResult()`

พบ helper ที่นำค่า argument ต่อเป็น HTML โดยไม่ escape ภายใน helper เช่น:
- `tileHtml(k, v, desc, hl)`
- `listHtml(items)`
- `stepsHtml(steps, color)`
- `rabbitTileHtml(...)`
- `nameTileHtml(...)`
- `relationTileHtml(...)`

จุดเหล่านี้ไม่ใช่ช่องโหว่โดยตัวมันเองถ้า input เป็นค่าคงที่ที่เชื่อถือได้และผ่านการควบคุมชนิด แต่เป็น HTML sink ที่ต้องตรวจ data flow จากชื่อ-นามสกุลและข้อมูล form ไปถึง renderer ทุกเส้นทาง

### X4-04 — Error message บางเส้นทางถูกต่อเข้า innerHTML

**สถานะ:** Confirmed  
**ตำแหน่งตัวอย่าง:** main calculation handler และ Oreguram handler

- Main calculation handler นำ `err.message` ต่อเข้า HTML โดยตรง
- Oreguram handler นำ `err.message` ต่อเข้า HTML โดยตรง
- Tarot/Rune handler มีการ escape `&`, `<`, `>`, `"` ก่อนแสดงผล
- Tarot/Rune fallback renderer มี helper escape เฉพาะจุด

จึงมีความแตกต่างของการจัดการ error ระหว่างโมดูล ข้อความ error ที่มาจาก exception ไม่ควรถูกถือว่า trusted HTML

**แนวทาง:** แสดง error ด้วย `textContent` หรือใช้ helper escape ที่ผ่านการทดสอบเดียวกันทุกโมดูล

### X4-05 — Static reflection text และ numeric code

**สถานะ:** ยังไม่พบหลักฐานว่าเป็น input ที่ผู้ใช้ควบคุม

ฟังก์ชัน `rabbitSubconsciousVoice()` และ `reflectionFor()` คืนข้อความจาก object/array ที่ประกาศอยู่ใน Source Code และค่าที่แทรกใน heading เป็นเลขที่ผ่านการ parse/range check ใน flow ที่ตรวจ จึงมีความเสี่ยงต่ำกว่าข้อความจาก form แต่ยังควรใช้ DOM text APIs เป็นมาตรฐานเมื่อปรับปรุงในอนาคต

### X4-06 — MutationObserver ไม่ใช่ตัว sanitize

**สถานะ:** Confirmed design observation

MutationObserver ในส่วน subconscious presentation ตรวจ DOM ที่เปลี่ยนและปรับ text nodes เพื่อเปลี่ยนสำนวน ไม่ได้ทำหน้าที่ escape หรือ sanitize HTML การเรียก observer หลัง render จึงไม่สามารถใช้เป็นหลักฐานว่าจุด HTML sink ปลอดภัย

## 3. ข้อสรุปด้าน XSS

ข้อสรุปที่ยืนยันได้จาก Source:
1. มี HTML sinks หลายตำแหน่ง
2. `warmOreguramText()` ไม่ได้ escape HTML
3. Error message บางโมดูลถูกต่อ HTML โดยตรง
4. มี renderer helper ที่ไม่ได้ escape argument ภายในตัวเอง
5. ยังไม่มี Browser payload test และยังไม่ได้พิสูจน์เส้นทางจาก attacker-controlled input ถึง sink อย่างครบถ้วน

**คำตัดสิน:** จัดเป็น Potential DOM XSS / unsafe HTML construction ที่ต้องแก้หรือพิสูจน์ความปลอดภัยก่อนปล่อยใช้งาน ไม่ระบุว่าเป็น confirmed exploitable XSS ในรายงานนี้

## 4. แนวทางแก้ที่ปลอดภัยโดยไม่เปลี่ยนเนื้อหาคำทำนาย

ลำดับที่แนะนำ:
1. แยกข้อความธรรมดาออกจาก markup และใช้ `textContent`/DOM creation APIs
2. หากจำเป็นต้องใช้ HTML string ให้ใช้ HTML escaping ที่ผ่าน unit tests กับทุก dynamic text node
3. สำหรับ class/style/attribute ให้ใช้ allowlist และไม่ใช้ text escape แทน attribute validation
4. ทำ data-flow inventory ว่าค่าจาก form แต่ละตัวไหลไปถึง renderer ใด
5. ห้ามแก้คำทำนาย สูตร หรือโครงสร้างผลลัพธ์ในงาน security patch เว้นแต่จำเป็นและได้รับอนุมัติ
6. ทำ regression test เปรียบเทียบข้อความ/ผลคำนวณก่อนและหลัง

## 5. Test Plan เพิ่มเติม

| ID | การทดสอบ | ผลที่คาดหวัง |
|---|---|---|
| XSS-01 | ป้อน `<img src=x onerror=alert(1)>` ในช่องข้อความที่รองรับ | ไม่มี script execution |
| XSS-02 | ป้อน `<svg onload=alert(1)>` ในช่องข้อความ | ไม่มี script execution |
| XSS-03 | ป้อน quote และ attribute breakout | ไม่สามารถสร้าง attribute/element ใหม่ |
| XSS-04 | จำลอง Error.message ที่มี HTML | แสดงเป็นข้อความ ไม่ execute |
| XSS-05 | ตรวจ Oreguram question/answer/detail | markup จากข้อมูลไม่ถูกตีความเป็น HTML |
| XSS-06 | ตรวจชื่อ/คำทำนาย/ข้อมูล renderer ทุกโมดูล | ไม่มี untrusted data เข้า HTML sink โดยไม่ escape |
| XSS-07 | Regression เปรียบเทียบ output ปกติ | ข้อความและรูปแบบคำทำนายเดิมยังคงเดิม |

## 6. ข้อจำกัด

- เป็น Static Inspection จาก Source Code เท่านั้น
- ยังไม่ทำ browser runtime หรือ payload execution
- ยังไม่ได้ทำ complete taint analysis ทุก property ใน data object
- ยังไม่ได้แก้ไข Source Code
- ไม่ได้ติดตั้ง dependency หรือเปลี่ยนสถาปัตยกรรม
