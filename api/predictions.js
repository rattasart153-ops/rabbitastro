const store = require("./_prediction-store");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }
  const token = req.headers["x-admin-token"];
  const gasUrl = process.env.GAS_WEB_APP_URL;
  if (typeof token !== "string" || token.length > 200) {
    return res.status(401).json({ ok: false, code: "UNAUTHORIZED", message: "กรุณาเข้าสู่ระบบเพื่อดูคำทำนาย" });
  }
  if (!gasUrl) return res.status(503).json({ ok: false, code: "AUTH_API_NOT_CONFIGURED", message: "ระบบยืนยันตัวตนยังไม่ได้ตั้งค่า" });
  try {
    const authResponse = await fetch(gasUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "adminValidateSession", token }),
      redirect: "follow"
    });
    const auth = await authResponse.json();
    if (!auth.ok) return res.status(401).json({ ok: false, code: "UNAUTHORIZED", message: auth.message || "กรุณาเข้าสู่ระบบใหม่" });
    const runtime = await store.runtime();
    res.setHeader("Cache-Control", "no-store, max-age=0");
    return res.status(200).json({ ok: true, runtime, publishedAt: new Date().toISOString() });
  } catch (error) {
    if (error.message === "GITHUB_TOKEN_NOT_CONFIGURED") {
      return res.status(503).json({ ok: false, code: error.message, message: "ยังไม่ได้ตั้งค่า GitHub Token สำหรับคลังคำทำนาย" });
    }
    return res.status(502).json({ ok: false, code: "PREDICTION_RUNTIME_UNAVAILABLE", message: "ไม่สามารถอ่านคลังคำทำนายจาก GitHub ได้" });
  }
};
