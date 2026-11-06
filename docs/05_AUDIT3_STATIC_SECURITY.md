# 05 — Audit รอบที่ 3: Static Security & Runtime Readiness

วันที่ตรวจ: 2026-11-04  
Branch ที่ตรวจ Source: `index`  
Source Commit: `da06441acbc3456f6feb33cbe5a415cfe1399eb9`  
Branch บันทึกเอกสาร: `rabbitastro-sandbox`

## 1. ขอบเขตและข้อจำกัด

รอบนี้ตรวจ Source Code เพิ่มเติมในประเด็น Input Validation, DOM/XSS sinks, Local Storage และ Error Handling

**ข้อจำกัดสำคัญ:** การเข้าถึง Source ผ่าน GitHub connector ไม่ได้เปิด Browser Runtime ให้รันเว็บไซต์จริง จึงยังไม่สามารถทำ Runtime/Browser Test, ทดสอบ payload ใน DOM, ตรวจ Network/Console หรือยืนยัน exploitability ได้ รายงานนี้จึงเป็น Static Review เท่านั้น

## 2. ข้อค้นพบ

### A3-01 — มีการประกอบ HTML แบบ Dynamic ผ่าน innerHTML

**สถานะ:** Confirmed static pattern / exploitability not confirmed  
**ความเสี่ยงเบื้องต้น:** ต้องตรวจต่อ (Potential DOM XSS)

ในส่วนแสดงผลโอเรกุรัมพบการประกอบ HTML ด้วย string concatenation และกำหนดผลลัพธ์ผ่าน `resultsBox.innerHTML = h` โดยมีการนำค่าจาก object ผลคำนวณ เช่น `res.catPrediction.overview`, `detail`, `example`, `action`, `advice`, `caution`, ชื่อกระต่าย/ธาตุ และข้อมูลทิศทางเพนดูลัม มาแสดงผ่าน HTML

พบการเรียก `warmOreguramText(...)` กับข้อความบางส่วน ซึ่งอาจเป็นชั้นแปลง/escape ข้อความ แต่ยังไม่ได้ยืนยัน implementation และ coverage ของ helper นี้ครบทุกจุด จึงยังสรุปไม่ได้ว่ามีช่องโหว่ XSS ที่ exploit ได้จริง

พบอีกจุดที่ประกอบ error message ด้วย `String(err && err.message ? err.message : err)` ลงใน HTML ผ่าน `innerHTML` ต้องหลีกเลี่ยงการนำ error string ที่ไม่เชื่อถือไปแทรก HTML โดยตรง

**สิ่งที่ต้องตรวจต่อ**
- ตรวจ implementation ของ `warmOreguramText` และ helper แสดงผลอื่นทั้งหมด
- ไล่ source ของทุกค่าที่ส่งเข้า HTML ว่ามาจาก static data, form input หรือ runtime error
- ทดสอบ payload เช่น `<img src=x onerror=alert(1)>` ในทุก input/output path บน Browser ทดสอบ
- พิจารณาใช้ `textContent` และ `createElement` สำหรับข้อความธรรมดา
- หากจำเป็นต้อง render rich HTML ให้ใช้ sanitizer ที่ผ่านการดูแลและกำหนด allowlist

**ข้อสรุป:** เป็นพื้นที่เสี่ยงที่ต้องตรวจ ไม่ใช่หลักฐานยืนยันช่องโหว่แล้ว

### A3-02 — Local Storage เก็บข้อมูลฟอร์มแบบไม่เข้ารหัส

**สถานะ:** Confirmed from source  
**ความเสี่ยงเบื้องต้น:** Privacy / local data exposure

พบ Local Storage key `horakratai_form_state_v1` และโค้ดบันทึกค่าจาก field ใน `#sharedForm` รวมถึง `#oreguramQuestion` โดยเก็บค่า field ตาม id ลง JSON และเรียก `localStorage.setItem`

มีการกู้คืนค่าจาก Local Storage เมื่อเริ่มต้นหน้าเว็บ และมี try/catch กรณี storage ใช้งานไม่ได้หรือ JSON เสียหาย

Local Storage ไม่ใช่ที่เก็บข้อมูลลับและ JavaScript ที่ทำงานใน origin เดียวกันสามารถอ่านข้อมูลนี้ได้ การเข้ารหัสฝั่ง Client ด้วย key ที่อยู่ในโค้ดเดียวกันไม่สามารถป้องกันผู้โจมตีที่รัน JavaScript ใน origin เดียวกันได้อย่างมีนัยสำคัญ

**สิ่งที่ต้องตรวจ/ตัดสินใจ**
- ระบุ field จริงทั้งหมดที่ถูกบันทึก รวมถึงชื่อ วันเกิด เวลาเกิด และคำถาม
- กำหนดอายุข้อมูลและวิธีล้างข้อมูล
- เพิ่ม UI ให้ผู้ใช้ล้างข้อมูลที่บันทึกในเครื่องได้
- พิจารณาไม่บันทึกข้อมูลที่ไม่จำเป็นหรือข้อมูลอ่อนไหว
- แจ้งผู้ใช้ว่าข้อมูลถูกเก็บไว้ใน Browser เครื่องนี้
- ทดสอบกรณีข้อมูลเก่า/JSON เสียหาย/schema เปลี่ยน

### A3-03 — Validation ระหว่างโมดูลไม่สม่ำเสมอ

**สถานะ:** Confirmed from prior source review; requires full-path retest  
**ความเสี่ยงเบื้องต้น:** Data integrity / inconsistent results

จากการตรวจ Source รอบก่อน `isSharedComplete()` ตรวจเพียงการมีค่าของชื่อ/นามสกุล/วัน/เดือน/ปี ไม่ตรวจความถูกต้องตามปฏิทิน ขณะที่การแสดงผลไพ่/รูนแบบ standalone มีการตรวจวันเกิดจริงและช่วงเวลา 00:00–23:59

**สิ่งที่ต้องทดสอบ**
- วันที่ 31/02, 29/02 ในปีอธิกสุรทินและปีปกติ
- เดือน 0, 13; วัน 0 และวันที่เกินจำนวนวันในเดือน
- เวลา 24:00, 23:60, ค่าว่าง และไม่ทราบเวลา
- ปี พ.ศ./ค.ศ. และการแปลงปี
- ค่า whitespace-only และค่าที่มีอักขระพิเศษ

ควรออกแบบ validation กลางโดยไม่เปลี่ยนพฤติกรรมเดิมจนกว่าจะอนุมัติผลกระทบ

### A3-04 — Error Handling มี try/catch แต่ยังต้องตรวจการแสดงผล

**สถานะ:** Confirmed partial pattern  
**ข้อสังเกต:** ปุ่มคำนวณโอเรกุรัมมี try/catch, log ข้อผิดพลาดลง console และแสดงข้อความ fallback ใน results box

การมี try/catch ช่วยป้องกัน flow ล้มโดยไม่จัดการ แต่ไม่ได้ยืนยันว่า error message ปลอดภัยหรือว่าทุกโมดูลมี error handling เทียบเท่ากัน

ต้องตรวจว่า:
- ข้อความ error ไม่เปิดเผยรายละเอียดภายในหรือข้อมูลส่วนบุคคล
- ไม่มีการนำ error.message ไปใส่ HTML โดยไม่ escape
- ทุก engine แสดง fallback ที่เหมาะสม
- console log ไม่เผยข้อมูลวันเกิด/ชื่อ/ข้อมูลผู้ใช้

## 3. ผลการตรวจตามหัวข้อ

| หัวข้อ | ผลรอบนี้ | หมายเหตุ |
|---|---|---|
| Dynamic HTML sinks | พบ | ต้อง trace/ทดสอบ XSS เพิ่ม |
| ยืนยัน XSS exploit | ยังไม่ได้ | ไม่มี Browser Runtime |
| Local Storage | พบการบันทึก/กู้คืน | ไม่เข้ารหัส; ต้องกำหนด retention/clear |
| Input validation | พบความไม่สม่ำเสมอจาก Source review | ต้องทำ test matrix |
| Error handling | พบ try/catch บาง flow | ยังไม่ครอบคลุมทุกโมดูล |
| Runtime/Browser | Blocked / Not Run | ยังไม่ได้เปิดเว็บไซต์ใน Browser |
| Security penetration test | Not Run | ไม่ได้ทดสอบโจมตีจริง |

## 4. Test Cases ที่ต้องรันใน Browser

| ID | กรณีทดสอบ | ผลที่คาดหวัง |
|---|---|---|
| RT-01 | กรอกวันเกิด 31/02 | ปฏิเสธพร้อมข้อความชัดเจน |
| RT-02 | กรอก 29/02 ปีอธิกสุรทิน | ยอมรับ |
| RT-03 | กรอก 29/02 ปีปกติ | ปฏิเสธ |
| RT-04 | เวลา 24:00 และ 23:60 | ปฏิเสธ |
| RT-05 | ไม่ทราบเวลาเกิด | ทุกโมดูลทำตามกติกาที่ระบุ |
| RT-06 | ปิด/เต็ม Local Storage | แอปยังใช้งานหลักได้ |
| RT-07 | Local Storage มี JSON เสียหาย | แอปไม่ crash และเริ่มต้นได้ |
| RT-08 | Reload หลังกรอกข้อมูล | คืนค่าเฉพาะ field ที่กำหนด |
| RT-09 | XSS payload ในช่องข้อความทุกช่อง | แสดงเป็นข้อความ ไม่ execute |
| RT-10 | Error จากการคำนวณ | แสดงข้อความทั่วไป ไม่เปิดเผยข้อมูลภายใน |
| RT-11 | ตรวจ console ระหว่าง flow หลัก | ไม่มี uncaught error หรือข้อมูลส่วนบุคคลรั่ว |
| RT-12 | ทดสอบมือถือ/แท็บเล็ต | ฟอร์มและผลลัพธ์ใช้งานได้ |

## 5. ข้อสรุปและลำดับงาน

1. **P0:** ตรวจ helper escape/sanitize และทุกจุดที่เขียน `innerHTML`
2. **P0:** กำหนดนโยบาย Local Storage และเพิ่มวิธีล้างข้อมูล
3. **P1:** ทำ validation test matrix และกำหนด expected behavior
4. **P1:** ตรวจ error handling ให้ครบทุก engine
5. **P2:** เปิด Browser Runtime และรัน RT-01 ถึง RT-12 พร้อมบันทึกหลักฐาน

ไม่มีการแก้ไข Source Code หรือเปลี่ยนพฤติกรรมแอปใน Audit รอบนี้
