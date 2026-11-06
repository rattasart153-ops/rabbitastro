  // แสดงธาตุประจำวันทันทีหลัง Engine โหลดเสร็จ
  // แยกออกจาก event handler หลัก เพื่อไม่ให้ฟีเจอร์อื่นที่มีปัญหาขัดขวางการแสดงผล
  (function renderDailyElementImmediate(){
    try {
      var E = window.Horakratai;
      var box = document.getElementById("dailyElementBox");
      if (!box || !E || typeof E.calcDailyElement !== "function") return;
      var r = E.calcDailyElement(new Date());
      var el = r && r.element ? r.element : (typeof E.getElement === "function" ? E.getElement(5) : null);
      if (!el) return;
      var rabbit = r.rabbit || {name:"-"};
      var dateEl = document.getElementById("dailyDateText");
      var valEl = document.getElementById("dailyElementVal");
      var iconEl = document.getElementById("dailyElementIcon");
      var descEl = document.getElementById("dailyElementDesc");
      var warnEl = document.getElementById("dailyElementWarn");
      var suggestEl = document.getElementById("dailyElementSuggest");
      if (dateEl) dateEl.textContent = r.dateText || "-";
      if (valEl) valEl.textContent = "ธาตุ" + (el.name || "ดิน") + " (" + (el.symbol || "⛰️") + ")";
      if (iconEl) iconEl.textContent = el.symbol || "⛰️";
      if (descEl) descEl.textContent = "🐇 กระต่ายเลข " + (r.finalNum || "-") + " (" + (rabbit.name || "-") + ")   " + (el.story || "") + " · จุดเด่น: " + (el.good || "");
      if (warnEl) warnEl.textContent = "⚠️ ดูแลเรื่องนี้อย่างอ่อนโยน: " + (el.bad || "");
      if (suggestEl) suggestEl.textContent = el.good || "ใช้พลังงานอย่างมีสติ";
      box.classList.remove("card-elem-น้ำ","card-elem-ไฟ","card-elem-ไม้","card-elem-เหล็ก","card-elem-ดิน","card-elem-ทอง");
      box.classList.add("card-elem-" + (el.name || "ดิน"));
      box.style.display = "block";
    } catch (err) {
      console.error("Daily element immediate render error:", err);
    }
  })();
