export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok:false, message:"Method not allowed" });
  const url = process.env.GAS_WEB_APP_URL;
  if (!url) return res.status(503).json({ ok:false, message:"ระบบจองคิวยังไม่ได้ตั้งค่า กรุณาติดต่อผู้ดูแล" });
  try {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const payload = { action:"createBooking", booking:body };
    const upstream = await fetch(url, { method:"POST", headers:{"Content-Type":"text/plain;charset=utf-8"}, body:JSON.stringify(payload), redirect:"follow" });
    const data = await upstream.json();
    return res.status(data.ok ? 201 : (data.code === "SLOT_TAKEN" ? 409 : 400)).json(data);
  } catch (error) {
    return res.status(502).json({ ok:false, message:"ไม่สามารถเชื่อมต่อระบบจองคิวได้ กรุณาลองใหม่ภายหลัง" });
  }
}