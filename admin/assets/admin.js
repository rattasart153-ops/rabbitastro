(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var loginPanel = $("loginPanel");
  var dashboard = $("dashboard");
  var token = sessionStorage.getItem("rabbitastro_admin_token") || "";
  var role = sessionStorage.getItem("rabbitastro_admin_role") || "";

  function showLogin(message) {
    dashboard.hidden = true;
    loginPanel.hidden = false;
    if (message) $("loginMessage").textContent = message;
  }

  function showDashboard(nextRole) {
    role = nextRole || role || "readonly";
    window.RABBITASTRO_ADMIN_ROLE = role;
    sessionStorage.setItem("rabbitastro_admin_role", role);
    loginPanel.hidden = true;
    dashboard.hidden = false;
    $("enginesPanel").hidden = false;
    $("showEngines").classList.add("active");
    var full = role === "full";
    if ($("showPredictions")) $("showPredictions").hidden = !full;
    if ($("showSystem")) $("showSystem").hidden = !full;
    if ($("predictionManagerPanel")) $("predictionManagerPanel").hidden = true;
    if ($("systemControlsPanel")) $("systemControlsPanel").hidden = true;
    $("showEngines").classList.remove("active");
    $("showEngines").classList.add("active");
    if (typeof window.RABBITASTRO_APPLY_SYSTEM_VISIBILITY === "function") window.RABBITASTRO_APPLY_SYSTEM_VISIBILITY();
    if (typeof window.RABBITASTRO_RELOAD_PREDICTIONS === "function") window.RABBITASTRO_RELOAD_PREDICTIONS();
  }

  function clearSession() {
    token = "";
    sessionStorage.removeItem("rabbitastro_admin_token");
    sessionStorage.removeItem("rabbitastro_admin_role");
    role = "";
  }

  async function api(payload) {
    var requestBody = Object.assign({}, payload);
    if (payload.action !== "adminLogin") requestBody.token = token;

    var response = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    var data = await response.json();
    if (response.status === 401) {
      clearSession();
      showLogin(data.message || "เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่");
      throw new Error(data.message || "กรุณาเข้าสู่ระบบใหม่");
    }
    if (!response.ok || !data.ok) {
      throw new Error(data.message || "เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
    return data;
  }

  $("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    var submit = $("loginSubmit");
    submit.disabled = true;
    $("loginMessage").textContent = "กำลังตรวจสอบข้อมูล…";
    try {
      var result = await api({
        action: "adminLogin",
        username: $("username").value.trim(),
        password: $("password").value
      });
      token = result.token;
      role = result.role || "readonly";
      sessionStorage.setItem("rabbitastro_admin_token", token);
      sessionStorage.setItem("rabbitastro_admin_role", role);
      $("password").value = "";
      $("loginMessage").textContent = "";
      showDashboard(role);
    } catch (error) {
      $("loginMessage").textContent = error.message;
    } finally {
      submit.disabled = false;
    }
  });

  $("showEngines").addEventListener("click", function () {
    $("enginesPanel").hidden = false;
    $("showEngines").classList.add("active");
  });

  $("logoutButton").addEventListener("click", async function () {
    var oldToken = token;
    try {
      if (oldToken) await api({ action: "adminLogout" });
    } catch (error) {
      // Clear the local session even if the upstream service is unavailable.
    }
    clearSession();
    $("password").value = "";
    showLogin("ออกจากระบบแล้ว");
  });

  async function restoreSession() {
    if (!token) {
      showLogin("");
      return;
    }
    try {
      var session = await api({ action: "adminValidateSession" });
      showDashboard(session.role || "readonly");
    } catch (error) {
      clearSession();
      showLogin(error.message || "กรุณาเข้าสู่ระบบใหม่");
    }
  }

  restoreSession();
})();
