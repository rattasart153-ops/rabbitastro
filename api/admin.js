module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  const url = process.env.GAS_WEB_APP_URL;
  if (!url) {
    return res.status(503).json({ ok: false, message: "ระบบยืนยันตัวตนยังไม่ได้ตั้งค่า" });
  }

  const body = req.body && typeof req.body === "object" ? req.body : {};
  const predictionActions = new Set(["predictionInitialize", "predictionList", "predictionSave", "predictionDelete", "predictionPublish", "predictionHistory", "predictionRollback"]);
  const allowed = new Set(["adminLogin", "adminValidateSession", "adminLogout", "adminSetCredentials", ...predictionActions]);
  if (!allowed.has(body.action)) {
    return res.status(400).json({ ok: false, message: "คำสั่งไม่ถูกต้อง" });
  }

  if (body.action === "adminLogin") {
    if (typeof body.username !== "string" || typeof body.password !== "string" ||
        body.username.length > 80 || body.password.length > 256) {
      return res.status(400).json({ ok: false, message: "กรุณาตรวจสอบชื่อผู้ใช้และรหัสผ่าน" });
    }
  } else if (typeof body.token !== "string" || body.token.length > 200) {
    return res.status(401).json({ ok: false, code: "UNAUTHORIZED", message: "กรุณาเข้าสู่ระบบใหม่" });
  }

  if (predictionActions.has(body.action)) {
    if (body.action === "predictionList" && (typeof body.collection !== "string" || body.collection.length > 40)) {
      return res.status(400).json({ ok: false, message: "ข้อมูลคลังคำทำนายไม่ถูกต้อง" });
    }
    if ((body.action === "predictionHistory" || body.action === "predictionRollback") && (typeof body.collection !== "string" || body.collection.length > 40 || typeof body.id !== "string" || body.id.length > 100)) {
      return res.status(400).json({ ok: false, message: "ข้อมูลประวัติคำทำนายไม่ถูกต้อง" });
    }
    if (body.action === "predictionRollback" && (!Number.isInteger(Number(body.version)) || Number(body.version) < 1)) {
      return res.status(400).json({ ok: false, message: "เวอร์ชันที่ต้องการกู้คืนไม่ถูกต้อง" });
    }
    if (body.action === "predictionSave" && (!body.record || typeof body.record !== "object" || JSON.stringify(body.record).length > 45000)) {
      return res.status(400).json({ ok: false, message: "ข้อมูลคำทำนายไม่ถูกต้องหรือมีขนาดใหญ่เกินไป" });
    }
  }

  try {
    const upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(body),
      redirect: "follow"
    });
    const data = await upstream.json();
    const status = data.ok ? 200 : (data.code === "UNAUTHORIZED" ? 401 : (data.code === "FORBIDDEN" ? 403 : 400));
    return res.status(status).json(data);
  } catch (error) {
    return res.status(502).json({
      ok: false,
      message: "ไม่สามารถเชื่อมต่อระบบยืนยันตัวตนได้"
    });
  }
};
