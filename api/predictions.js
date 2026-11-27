module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  const url = process.env.GAS_WEB_APP_URL;
  const token = req.headers["x-admin-token"];
  if (typeof token !== "string" || token.length > 200) {
    return res.status(401).json({ ok:false, code:"UNAUTHORIZED", message:"กรุณาเข้าสู่ระบบเพื่อดูคำทำนาย" });
  }
  if (!url) return res.status(503).json({ ok: false, code: "PREDICTION_API_NOT_CONFIGURED" });

  try {
    const upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "predictionRuntime", token }),
      redirect: "follow"
    });
    const data = await upstream.json();
    res.setHeader("Cache-Control", "no-store, max-age=0");
    if (!upstream.ok || !data.ok) {
      return res.status(data.code === "UNAUTHORIZED" ? 401 : 503).json({
        ok: false,
        code: data.code || "PREDICTION_RUNTIME_UNAVAILABLE",
        message: data.message || "คลังคำทำนายยังไม่พร้อมใช้งาน"
      });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(502).json({
      ok: false,
      code: "PREDICTION_RUNTIME_CONNECTION_FAILED",
      message: "ไม่สามารถเชื่อมต่อคลังคำทำนายได้"
    });
  }
};
