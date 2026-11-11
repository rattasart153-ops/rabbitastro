(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var loginPanel = $("loginPanel");
  var dashboard = $("dashboard");
  var token = sessionStorage.getItem("rabbitastro_admin_token") || "";

  function showLogin(message) {
    dashboard.hidden = true;
    loginPanel.hidden = false;
    if (message) $("loginMessage").textContent = message;
  }

  function showDashboard() {
    loginPanel.hidden = true;
    dashboard.hidden = false;
    $("enginesPanel").hidden = false;
    $("showEngines").classList.add("active");
  }

  function clearSession() {
    token = "";
    sessionStorage.removeItem("rabbitastro_admin_token");
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
      sessionStorage.setItem("rabbitastro_admin_token", token);
      $("password").value = "";
      $("loginMessage").textContent = "";
      showDashboard();
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
      await api({ action: "adminValidateSession" });
      showDashboard();
    } catch (error) {
      clearSession();
      showLogin(error.message || "กรุณาเข้าสู่ระบบใหม่");
    }
  }

  restoreSession();
})();
