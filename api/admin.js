module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok:false, message:"Method not allowed" });
  const url = process.env.GAS_WEB_APP_URL;
  if (!url) return res.status(503).json({ ok:false, message:"ระบบหลังบ้านยังไม่ได้ตั้งค่า" });
  const body = req.body && typeof req.body === "object" ? req.body : {};
  const allowed = new Set(["adminLogin","adminListBookings","adminUpdateBooking"]);
  if (!allowed.has(body.action)) return res.status(400).json({ ok:false, message:"คำสั่งไม่ถูกต้อง" });
  if (body.action !== "adminLogin" && (typeof body.token !== "string" || body.token.length > 200)) return res.status(401).json({ ok:false, message:"กรุณาเข้าสู่ระบบใหม่" });
  try {
    const upstream = await fetch(url, { method:"POST", headers:{"Content-Type":"text/plain;charset=utf-8"}, body:JSON.stringify(body), redirect:"follow" });
    const data = await upstream.json();
    return res.status(data.ok ? 200 : (data.code === "UNAUTHORIZED" ? 401 : 400)).json(data);
  } catch (error) {
    return res.status(502).json({ ok:false, message:"ไม่สามารถเชื่อมต่อฐานข้อมูลได้" });
  }
};