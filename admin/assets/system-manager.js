(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var panel = $("systemControlsPanel");
  if (!panel) return;
  function token() { return sessionStorage.getItem("rabbitastro_admin_token") || ""; }
  function isFull() { return sessionStorage.getItem("rabbitastro_admin_role") === "full"; }
  function message(text, error) {
    var node = $("systemControlMessage");
    node.textContent = text || "";
    node.style.color = error ? "#a33b32" : "#39734d";
  }
  async function request(action, extra) {
    if (!isFull()) throw new Error("บัญชีนี้ไม่มีสิทธิ์จัดการระบบ");
    var response = await fetch("/api/admin", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.assign({ action: action, token: token() }, extra || {}))
    });
    var data = await response.json();
    if (response.status === 401 || response.status === 403) throw new Error(data.message || "ไม่มีสิทธิ์ดำเนินการ");
    if (!response.ok || !data.ok) throw new Error(data.message || "ไม่สามารถดำเนินการได้");
    return data;
  }
  function itemRow(record, collection) {
    var row = document.createElement("div");
    row.className = "system-control-row";
    var copy = document.createElement("div");
    var title = document.createElement("strong");
    title.textContent = record.title || record.name || record.id;
    var sub = document.createElement("small");
    sub.textContent = record.engineId + " · " + (record.status === "active" ? "เปิดใช้งาน" : "ซ่อนอยู่");
    copy.appendChild(title); copy.appendChild(sub);
    var label = document.createElement("label");
    label.className = "system-toggle";
    var input = document.createElement("input");
    input.type = "checkbox";
    input.checked = record.status === "active";
    input.setAttribute("aria-label", "เปิดใช้งาน " + title.textContent);
    input.addEventListener("change", async function () {
      input.disabled = true;
      try {
        var next = Object.assign({}, record, { status: input.checked ? "active" : "inactive" });
        await request("predictionSave", { collection: collection, record: next });
        message("บันทึกสถานะ " + title.textContent + " แล้ว");
        await load();
        if (typeof window.RABBITASTRO_RELOAD_PREDICTIONS === "function") await window.RABBITASTRO_RELOAD_PREDICTIONS();
      } catch (error) {
        input.checked = !input.checked;
        message(error.message, true);
      } finally { input.disabled = false; }
    });
    var slider = document.createElement("span");
    slider.className = "system-toggle-track";
    label.appendChild(input); label.appendChild(slider);
    row.appendChild(copy); row.appendChild(label);
    return row;
  }
  async function renderCollection(targetId, collection) {
    var target = $(targetId);
    target.textContent = "";
    var data = await request("predictionList", { collection: collection });
    (data.records || []).sort(function(a,b){return Number(a.sortOrder||0)-Number(b.sortOrder||0);})
      .forEach(function(record){ target.appendChild(itemRow(record, collection)); });
    if (!(data.records || []).length) {
      var empty = document.createElement("p");
      empty.className = "muted";
      empty.textContent = "ยังไม่มีข้อมูล กรุณาเริ่มต้นคลังคำทำนายก่อน";
      target.appendChild(empty);
    }
  }
  async function load() {
    if (!isFull()) return;
    message("กำลังโหลดสถานะระบบ…");
    try {
      await renderCollection("systemEngineList", "Engines");
      await renderCollection("systemFeatureList", "Features");
      message("โหลดสถานะระบบแล้ว");
    } catch (error) { message(error.message, true); }
  }
  $("adminCredentialsForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    if (!isFull()) return;
    var form = event.currentTarget;
    if (!form.reportValidity()) return;
    var submit = form.querySelector('button[type="submit"]');
    submit.disabled = true;
    try {
      await request("adminSetCredentials", {
        fullUsername: $("newFullUsername").value.trim(),
        fullPassword: $("newFullPassword").value,
        readonlyUsername: $("newReadonlyUsername").value.trim(),
        readonlyPassword: $("newReadonlyPassword").value
      });
      alert("เปลี่ยนบัญชี Admin สำเร็จ กรุณาเข้าสู่ระบบด้วยบัญชีใหม่");
      sessionStorage.removeItem("rabbitastro_admin_token");
      sessionStorage.removeItem("rabbitastro_admin_role");
      window.location.reload();
    } catch (error) {
      message(error.message, true);
    } finally { submit.disabled = false; }
  });
  $("showSystem").addEventListener("click", function () {
    if (!isFull()) return;
    $("enginesPanel").hidden = true;
    $("predictionManagerPanel").hidden = true;
    panel.hidden = false;
    $("showEngines").classList.remove("active");
    $("showPredictions").classList.remove("active");
    $("showSystem").classList.add("active");
    load();
  });
  $("showEngines").addEventListener("click", function () {
    panel.hidden = true;
    $("showSystem").classList.remove("active");
  });
  $("showPredictions").addEventListener("click", function () {
    panel.hidden = true;
    $("showSystem").classList.remove("active");
  });
})();
