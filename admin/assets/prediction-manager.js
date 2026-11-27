(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var panel = $("predictionManagerPanel");
  if (!panel) return;
  var selectedId = "";
  var records = [];
  var collections = ["Predictions", "Categories", "Topics", "Variables", "Rules", "Mappings", "Engines"];

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
  function displayName(record) {
    return record.title || record.name || record.id || "รายการไม่มีชื่อ";
  }
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
  function selectRecord(record) {
    selectedId = record.id;
    $("predictionEditorTitle").textContent = "แก้ไข: " + displayName(record);
    $("predictionJsonEditor").value = JSON.stringify(record, null, 2);
    renderList();
  }
  function blankRecord() {
    var engineId = currentEngine() || "engine1";
    var record = {
      engineId: engineId,
      parentId: "",
      name: "",
      title: "",
      description: "",
      content: "",
      data: {},
      priority: 100,
      status: "draft",
      sortOrder: 100
    };
    if (currentCollection() === "Rules") {
      record.data = { logic: "AND", predictionId: "", conditions: [{ variable: "", operator: "eq", value: "" }] };
    }
    if (currentCollection() === "Variables") {
      record.data = { key: "", dataType: "string", source: "", description: "" };
    }
    return record;
  }
  async function loadRecords() {
    setMessage("กำลังโหลดข้อมูล…");
    try {
      var result = await request("predictionList", {
        collection: currentCollection(),
        engineId: currentEngine()
      });
      records = result.records || [];
      selectedId = "";
      $("predictionJsonEditor").value = "";
      $("predictionEditorTitle").textContent = "ตัวแก้ไขข้อมูล";
      $("predictionSetup").hidden = true;
      renderList();
      setMessage("โหลดข้อมูลสำเร็จ");
    } catch (error) {
      if (/ยังไม่ได้ตั้งค่า|not initialized|PREDICTION_STORE_NOT_INITIALIZED/i.test(error.message)) {
        $("predictionSetup").hidden = false;
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
      await loadRecords();
    } catch (error) {
      setMessage(error.message, true);
    } finally {
      button.disabled = false;
    }
  }
  async function save(publish) {
    var record;
    try {
      record = JSON.parse($("predictionJsonEditor").value);
    } catch (error) {
      setMessage("JSON ไม่ถูกต้อง กรุณาตรวจสอบวงเล็บและเครื่องหมายคำพูด", true);
      return;
    }
    if (!record || typeof record !== "object" || Array.isArray(record)) {
      setMessage("ข้อมูลต้องเป็น JSON Object", true);
      return;
    }
    if (selectedId && !record.id) record.id = selectedId;
    if (publish && !record.id) {
      setMessage("กรุณาบันทึกฉบับร่างก่อนเผยแพร่", true);
      return;
    }
    var saveButton = $("predictionSave");
    saveButton.disabled = true;
    try {
      var result = await request("predictionSave", { collection: currentCollection(), record: record });
      var savedId = result.record.id;
      selectedId = savedId;
      if (publish) {
        await request("predictionPublish", { collection: currentCollection(), id: savedId });
      }
      setMessage(publish ? "บันทึกและเผยแพร่เรียบร้อย" : "บันทึกฉบับร่างและสร้างประวัติเวอร์ชันแล้ว");
      await loadRecords();
      var saved = records.find(function (item) { return item.id === savedId; });
      if (saved) selectRecord(saved);
    } catch (error) {
      setMessage(error.message, true);
    } finally {
      saveButton.disabled = false;
    }
  }
  async function archive() {
    if (!selectedId) {
      setMessage("กรุณาเลือกรายการที่ต้องการเก็บเข้าคลังก่อน", true);
      return;
    }
    if (!window.confirm("ยืนยันเก็บรายการนี้เข้าคลัง? ระบบจะไม่ลบข้อมูลถาวร")) return;
    try {
      await request("predictionDelete", { collection: currentCollection(), id: selectedId });
      selectedId = "";
      $("predictionJsonEditor").value = "";
      await loadRecords();
      setMessage("เก็บรายการเข้าคลังแล้ว");
    } catch (error) {
      setMessage(error.message, true);
    }
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
    $("predictionEditorTitle").textContent = "สร้างรายการใหม่";
    $("predictionJsonEditor").value = JSON.stringify(blankRecord(), null, 2);
    renderList();
    setMessage("กำลังสร้างรายการใหม่ในสถานะ Draft");
  });
  $("predictionSave").addEventListener("click", function () { save(false); });
  $("predictionPublish").addEventListener("click", function () { save(true); });
  $("predictionArchive").addEventListener("click", archive);
  $("predictionCollection").addEventListener("change", loadRecords);
  $("predictionEngineFilter").addEventListener("change", loadRecords);
})();