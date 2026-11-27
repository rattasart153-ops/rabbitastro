(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var panel = $("predictionManagerPanel");
  if (!panel) return;
  var selectedId = "";
  var records = [];

  function token() { return sessionStorage.getItem("rabbitastro_admin_token") || ""; }
  function setMessage(message, isError) {
    var node = $("predictionMessage");
    node.textContent = message || "";
    node.style.color = isError ? "#a33b32" : "#39734d";
  }
  async function request(action, extra) {
    var response = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.assign({ action: action, token: token() }, extra || {}))
    });
    var data = await response.json();
    if (response.status === 401) {
      sessionStorage.removeItem("rabbitastro_admin_token");
      throw new Error(data.message || "เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่");
    }
    if (!response.ok || !data.ok) throw new Error(data.message || "ไม่สามารถดำเนินการได้");
    return data;
  }
  function currentCollection() { return $("predictionCollection").value; }
  function currentEngine() { return $("predictionEngineFilter").value; }
  function displayName(record) { return record.title || record.name || record.id || "รายการไม่มีชื่อ"; }

  function renderList() {
    var list = $("predictionRecordList");
    list.textContent = "";
    $("predictionCount").textContent = records.length + " รายการ";
    if (!records.length) {
      var empty = document.createElement("p");
      empty.className = "muted";
      empty.textContent = "ยังไม่มีข้อมูลในหมวดนี้";
      list.appendChild(empty);
      return;
    }
    records.forEach(function (record) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "prediction-record-item" + (record.id === selectedId ? " active" : "");
      var title = document.createElement("strong");
      title.textContent = displayName(record);
      var meta = document.createElement("small");
      meta.textContent = record.engineId + " · " + record.status + " · v" + record.version;
      button.appendChild(title);
      button.appendChild(meta);
      button.addEventListener("click", function () { selectRecord(record); });
      list.appendChild(button);
    });
  }

  function fillEditor(record, heading) {
    $("predictionRecordId").value = record.id || "";
    $("predictionEngineField").value = record.engineId || "engine1";
    $("predictionNameField").value = record.name || "";
    $("predictionTitleField").value = record.title || "";
    $("predictionDescriptionField").value = record.description || "";
    $("predictionContentField").value = record.content || "";
    $("predictionStatusField").value = ["draft", "inactive", "active", "archived"].indexOf(record.status) >= 0 ? record.status : "draft";
    $("predictionPriorityField").value = Number.isFinite(Number(record.priority)) ? record.priority : 100;
    $("predictionSortOrderField").value = Number.isFinite(Number(record.sortOrder)) ? record.sortOrder : 100;
    $("predictionParentField").value = record.parentId || "";
    $("predictionDataField").value = JSON.stringify(record.data || {}, null, 2);
    $("predictionEditorTitle").textContent = heading || (record.id ? "แก้ไข: " + displayName(record) : "สร้างรายการใหม่");
  }
  function selectRecord(record) {
    selectedId = record.id;
    fillEditor(record);
    renderList();
  }
  function blankRecord() {
    var record = {
      engineId: currentEngine() || "engine1",
      parentId: "", name: "", title: "", description: "", content: "",
      data: {}, priority: 100, status: "draft", sortOrder: 100
    };
    if (currentCollection() === "Rules") {
      record.data = { slot: record.engineId + ".base", logic: "AND", predictionId: "", conditions: [{ variable: "birth.month", operator: "eq", value: 1 }] };
    }
    if (currentCollection() === "Mappings") {
      record.data = { slot: record.engineId + ".base", predictionId: "", logic: "AND" };
    }
    if (currentCollection() === "Variables") {
      record.data = { key: "", dataType: "string", source: "", description: "" };
    }
    return record;
  }
  function readEditor() {
    var data;
    try { data = JSON.parse($("predictionDataField").value || "{}"); }
    catch (error) { throw new Error("ข้อมูลเพิ่มเติมไม่ใช่ JSON ที่ถูกต้อง"); }
    if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("ข้อมูลเพิ่มเติมต้องเป็น JSON Object");
    var record = {
      id: $("predictionRecordId").value || undefined,
      engineId: $("predictionEngineField").value,
      parentId: $("predictionParentField").value.trim(),
      name: $("predictionNameField").value.trim(),
      title: $("predictionTitleField").value.trim(),
      description: $("predictionDescriptionField").value.trim(),
      content: $("predictionContentField").value,
      data: data,
      priority: Number($("predictionPriorityField").value || 100),
      status: $("predictionStatusField").value,
      sortOrder: Number($("predictionSortOrderField").value || 100)
    };
    if (!record.name && !record.title) throw new Error("กรุณากรอกชื่ออ้างอิงหรือชื่อหัวข้อ");
    return record;
  }

  async function loadRecords() {
    setMessage("กำลังโหลดข้อมูล…");
    try {
      var result = await request("predictionList", { collection: currentCollection(), engineId: currentEngine() });
      records = result.records || [];
      selectedId = "";
      fillEditor(blankRecord(), "ตัวแก้ไขข้อมูล");
      $("predictionSetup").hidden = true;
      renderList();
      setMessage("โหลดข้อมูลสำเร็จ");
    } catch (error) {
      if (!$("predictionSetup").hidden) {
        // The store has not been initialized yet; keep the setup prompt visible.
      }
      setMessage(error.message, true);
    }
  }
  async function initialize() {
    var button = $("predictionInitialize");
    button.disabled = true;
    setMessage("กำลังสร้างคลังคำทำนายใน Google Sheets…");
    try {
      var result = await request("predictionInitialize");
      $("predictionSetup").hidden = true;
      setMessage("สร้างคลังคำทำนายสำเร็จ: " + result.spreadsheetName + " · ID " + result.spreadsheetId);
      if (typeof window.RABBITASTRO_RELOAD_PREDICTIONS === "function") await window.RABBITASTRO_RELOAD_PREDICTIONS();
      await loadRecords();
    } catch (error) {
      setMessage(error.message, true);
    } finally {
      button.disabled = false;
    }
  }
  async function save(publish) {
    var record;
    try { record = readEditor(); }
    catch (error) { setMessage(error.message, true); return; }
    if (publish && !record.id) {
      setMessage("กรุณาบันทึกฉบับร่างก่อนเผยแพร่", true);
      return;
    }
    $("predictionSave").disabled = true;
    try {
      var result = await request("predictionSave", { collection: currentCollection(), record: record });
      var savedId = result.record.id;
      if (publish) {
        await request("predictionPublish", { collection: currentCollection(), id: savedId });
        if (typeof window.RABBITASTRO_RELOAD_PREDICTIONS === "function") await window.RABBITASTRO_RELOAD_PREDICTIONS();
      }
      await loadRecords();
      var saved = records.find(function (item) { return item.id === savedId; });
      if (saved) selectRecord(saved);
      setMessage(publish ? "บันทึกและเผยแพร่เรียบร้อย" : "บันทึกฉบับร่างและสร้างประวัติเวอร์ชันแล้ว");
    } catch (error) {
      setMessage(error.message, true);
    } finally {
      $("predictionSave").disabled = false;
    }
  }
  async function archive() {
    if (!selectedId) { setMessage("กรุณาเลือกรายการที่ต้องการเก็บเข้าคลังก่อน", true); return; }
    if (!window.confirm("ยืนยันเก็บรายการนี้เข้าคลัง? ระบบจะไม่ลบข้อมูลถาวร")) return;
    try {
      await request("predictionDelete", { collection: currentCollection(), id: selectedId });
      selectedId = "";
      if (typeof window.RABBITASTRO_RELOAD_PREDICTIONS === "function") await window.RABBITASTRO_RELOAD_PREDICTIONS();
      await loadRecords();
      setMessage("เก็บรายการเข้าคลังแล้ว");
    } catch (error) { setMessage(error.message, true); }
  }

  $("showPredictions").addEventListener("click", function () {
    $("enginesPanel").hidden = true;
    panel.hidden = false;
    $("showPredictions").classList.add("active");
    $("showEngines").classList.remove("active");
    loadRecords();
  });
  $("showEngines").addEventListener("click", function () {
    panel.hidden = true;
    $("enginesPanel").hidden = false;
    $("showPredictions").classList.remove("active");
  });
  $("predictionLoad").addEventListener("click", loadRecords);
  $("predictionInitialize").addEventListener("click", initialize);
  $("predictionNew").addEventListener("click", function () {
    selectedId = "";
    fillEditor(blankRecord(), "สร้างรายการใหม่");
    renderList();
    setMessage("กำลังสร้างรายการใหม่ในสถานะ Draft");
  });
  $("predictionSave").addEventListener("click", function () { save(false); });
  $("predictionPublish").addEventListener("click", function () { save(true); });
  $("predictionArchive").addEventListener("click", archive);
  $("predictionHistoryButton").addEventListener("click", function () {
    $("predictionHistoryPanel").hidden = !$("predictionHistoryPanel").hidden;
    if (!$("predictionHistoryPanel").hidden) loadHistory();
  });
  $("predictionHistoryLoad").addEventListener("click", loadHistory);
  $("predictionRollback").addEventListener("click", rollbackVersion);
  $("predictionPreviewButton").addEventListener("click", previewRule);
  $("predictionCollection").addEventListener("change", function () {
    selectedId = "";
    $("predictionHistoryPanel").hidden = true;
    loadRecords();
  });
  $("predictionEngineFilter").addEventListener("change", loadRecords);
})();