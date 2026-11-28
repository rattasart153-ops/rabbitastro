const store = require("./_prediction-store");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    const runtime = await store.runtime();
    const allowedEngine1Parents = new Set(["MATRIX_ARCANA", "SPECIFIC_PREDICTIONS_DETAILED"]);
    const predictions = (runtime.Predictions || [])
      .filter((record) =>
        record.status === "published" && (
          (record.engineId === "engine1" && allowedEngine1Parents.has(record.parentId)) ||
          (record.engineId === "engine2" && record.parentId === "GOD_DATA")
        )
      )
      .map((record) => ({
        id: record.id,
        engineId: record.engineId,
        parentId: record.parentId,
        title: record.title,
        content: record.content,
        status: record.status,
        data: { payload: record.data && record.data.payload ? record.data.payload : {} }
      }));
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    res.setHeader("X-Content-Type-Options", "nosniff");
    return res.status(200).json({ ok: true, runtime: { Predictions: predictions } });
  } catch (error) {
    if (error.message === "GITHUB_TOKEN_NOT_CONFIGURED") {
      return res.status(503).json({ ok: false, code: error.message, message: "Prediction repository is not configured" });
    }
    return res.status(502).json({ ok: false, code: "PUBLIC_PREDICTIONS_UNAVAILABLE", message: "Unable to load published predictions" });
  }
};
