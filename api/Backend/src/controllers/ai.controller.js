const aiService = require('../services/ai.service');

module.exports.getReview = async (req, res) => {
  try {
    const code = req.body.code;
    if (!code) return res.status(400).json({ review: [{ title: "Error", content: "Code is required" }] });

    const review = await aiService(code);
    res.status(200).json(review);
  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({ review: [{ title: "Error", content: "Something went wrong" }] });
  }
};
