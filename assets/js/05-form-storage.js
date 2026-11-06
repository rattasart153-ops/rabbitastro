  // ---------- Local Storage: บันทึกข้อมูลแบบฟอร์มในเครื่องผู้ใช้ ----------
  (function () {
    'use strict';
    var STORAGE_KEY = 'horakratai_form_state_v1';
    var FIELD_SELECTOR = '#sharedForm input, #sharedForm select, #sharedForm textarea, #oreguramQuestion';

    function getFields() {
      return Array.prototype.slice.call(document.querySelectorAll(FIELD_SELECTOR));
    }

    function saveFormState() {
      try {
        var state = {};
        getFields().forEach(function (field) {
          if (!field.id) return;
          if (field.type === 'checkbox' || field.type === 'radio') {
            state[field.id] = { type: field.type, checked: field.checked };
          } else {
            state[field.id] = { type: field.tagName.toLowerCase(), value: field.value };
          }
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (err) {
        // Storage อาจถูกปิดหรือเต็ม ให้แอปหลักทำงานต่อได้ตามปกติ
        console.warn('ไม่สามารถบันทึกข้อมูลลง Local Storage ได้', err);
      }
    }

    function restoreFormState() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        var state = JSON.parse(raw);
        getFields().forEach(function (field) {
          if (!field.id || !Object.prototype.hasOwnProperty.call(state, field.id)) return;
          var saved = state[field.id];
          if (!saved) return;
          if (field.type === 'checkbox' || field.type === 'radio') {
            if (saved.type === field.type) field.checked = !!saved.checked;
          } else if (typeof saved.value === 'string') {
            // เลือกค่าได้เฉพาะเมื่อยังมี option รองรับ ป้องกัน select กลายเป็นค่าว่าง
            if (field.tagName !== 'SELECT' || Array.prototype.some.call(field.options, function (o) { return o.value === saved.value; })) {
              field.value = saved.value;
            }
          }
        });
      } catch (err) {
        console.warn('ไม่สามารถกู้คืนข้อมูลจาก Local Storage ได้', err);
      }
    }

    function initLocalStorage() {
      restoreFormState();
      document.addEventListener('input', function (event) {
        if (event.target && event.target.matches(FIELD_SELECTOR)) saveFormState();
      });
      document.addEventListener('change', function (event) {
        if (event.target && event.target.matches(FIELD_SELECTOR)) saveFormState();
      });
      // เผื่อมีการสร้างหรือเติมตัวเลือกคำถามภายหลังจากเริ่มหน้าเว็บ
      saveFormState();
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initLocalStorage);
    } else {
      initLocalStorage();
    }
  })();
