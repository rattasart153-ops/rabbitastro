# Rabbitastro

เว็บไซต์พยากรณ์และเครื่องมือคำนวณตามศาสตร์เฉพาะของโครงการ Rabbitastro

## Current source layout

- `index.html` — หน้าเว็บหลักและลำดับการโหลดสคริปต์
- `assets/css/styles.css` — CSS ที่แยกจากเอกสารต้นฉบับ
- `assets/js/01-daily-r9.js` — ระบบเลขกระต่ายประจำวัน
- `assets/js/02-horakratai-engine.js` — Engine หลักของโหรกระต่าย
- `assets/js/03-daily-element.js` — การแสดงผลธาตุประจำวัน
- `assets/js/04-ui-renderers.js` — UI, การจัดการฟอร์ม และ renderer
- `assets/js/05-form-storage.js` — การจัดเก็บข้อมูลฟอร์มใน Local Storage
- `assets/js/06-subconscious-presentation.js` — ส่วนแสดงผล subconscious

JavaScript ใช้ classic script tags และต้องรักษาลำดับการโหลดตามหมายเลขไฟล์ เนื่องจากบางไฟล์ใช้ global ที่ประกาศโดยไฟล์ก่อนหน้า

## Project documents

เริ่มอ่านจาก [ภาพรวมโครงการ](docs/00_PROJECT_OVERVIEW.md), [System Specification](docs/01_SYSTEM_SPECIFICATION.md), [Source Code Audit](docs/02_SOURCE_CODE_AUDIT.md), [Test Plan](docs/04_TEST_PLAN.md), [Security Remediation](docs/08_SECURITY_REMEDIATION.md) และ [Integration Record](docs/10_INTEGRATION_AND_PRESERVATION.md)

## Branch and source history

- Branch หลักปัจจุบัน: `main`
- โครงสร้างแยกไฟล์และเอกสาร Audit จากงานใน `index` และ `rabbitastro-sandbox` ถูกรวมเข้าประวัติของ `main`
- เอกสาร Audit เดิมเป็นบันทึกตามวันที่และ Source baseline ในขณะนั้น ไม่ใช่ผลยืนยัน Runtime ปัจจุบัน

## Verification status

- ตรวจว่า HTML shell หลังแยกไฟล์ตรงกับ markup ของ Source ต้นฉบับ โดยไม่นับช่องว่างและการเยื้อง: ผ่าน
- ตรวจว่า CSS และ JavaScript ถูกแยกจาก Source เดิมโดยไม่แก้เนื้อหา: ผ่าน
- ตรวจ JavaScript syntax แบบ compile-only ครบ 6 ไฟล์: ผ่าน
- เจ้าของโครงการเคยรายงานว่าเปิดเว็บและคำนวณผ่าน Browser ได้บน Branch ที่ทดสอบก่อนการรวมครั้งนี้ แต่ยังไม่ได้ทดสอบ Browser ซ้ำหลังการรวมและแยกไฟล์รอบนี้

การตรวจ Static ไม่ใช่สิ่งทดแทน Browser/runtime regression test
