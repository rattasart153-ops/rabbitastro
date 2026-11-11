# Rabbitastro

เว็บไซต์พยากรณ์และเครื่องมือคำนวณตามศาสตร์เฉพาะของโครงการ Rabbitastro

## Current source layout

- `index.html` — หน้าเว็บหลัก
- `assets/css/styles.css` — รูปแบบการแสดงผล
- `assets/js/01-daily-r9.js` — ระบบเลขกระต่ายประจำวัน
- `assets/js/02-horakratai-engine.js` — Engine หลักของโหรกระต่าย
- `assets/js/03-daily-element.js` — การคำนวณและแสดงผลธาตุประจำวัน
- `assets/js/04-ui-renderers.js` — การจัดการแท็บ ฟอร์ม และผลคำทำนาย
- `assets/js/05-form-storage.js` — การจัดเก็บข้อมูลฟอร์มใน Local Storage
- `assets/js/06-subconscious-presentation.js` — ส่วนแสดงผล subconscious
- `admin/` — พื้นที่เครื่องมือคำนวณและแสดงผลสำหรับผู้ดูแล โดยไม่มีระบบจองคิว
- `docs/` — เอกสารโครงการ การตรวจสอบ และแผนทดสอบ

JavaScript ใช้ classic script tags และต้องรักษาลำดับการโหลดตามหมายเลขไฟล์ เนื่องจากบางไฟล์ใช้ global ที่ประกาศโดยไฟล์ก่อนหน้า

## Engines

1. ดวงบุคคล
2. เทพประจำตัว
3. โอเรกุรัม
4. ไพ่ทาโรต์ + รูน

ระบบจองคิวดูดวงและส่วนเชื่อมต่อที่เกี่ยวข้องถูกถอดออกจาก Source Code แล้ว ข้อมูลการจองเดิมใน Google Sheets ไม่ได้ถูกลบโดยการเปลี่ยนแปลงนี้

## Project documents

เริ่มอ่านจาก [ภาพรวมโครงการ](docs/00_PROJECT_OVERVIEW.md), [System Specification](docs/01_SYSTEM_SPECIFICATION.md), [Source Code Audit](docs/02_SOURCE_CODE_AUDIT.md), [Test Plan](docs/04_TEST_PLAN.md), [Security Remediation](docs/08_SECURITY_REMEDIATION.md) และ [Integration Record](docs/10_INTEGRATION_AND_PRESERVATION.md)

## Branch and source history

- Branch ที่ใช้งานสำหรับการเปลี่ยนแปลงชุดนี้: `test-admin`
- ไม่แก้ไข `main` โดยตรง
- เอกสาร Audit เดิมเป็นบันทึกตามวันที่และ Source baseline ในขณะนั้น ไม่ใช่ผลยืนยัน Runtime ปัจจุบัน

## Verification status

- การถอดระบบจองคิวเป็นการเปลี่ยนแปลง Source Code บน Branch ทดลอง
- ต้องทดสอบ Browser จริงทั้งหน้า Main และ `/admin` หลัง Deployment
- การตรวจ Static ไม่ใช่สิ่งทดแทน Browser/runtime regression test
