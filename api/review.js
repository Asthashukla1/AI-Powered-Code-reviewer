// /api/review.js
import generateReview from "../services/ai.service.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: "Code is required" });
    }

    const response = await generateReview(code);
    return res.status(200).json(response);
  } catch (err) {
    console.error("API Error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
