// Backend/src/controllers/ai.controller.js
const aiService = require('../services/ai.service');

const getReview = async (req, res) => {
  try {
    const { code, language = 'javascript' } = req.body;
    
    if (!code) {
      return res.status(400).json({
        review: [{ title: "Input Error", content: "Code content is required for review." }]
      });
    }

    // Service now returns a single object { review: [{ title: "...", content: "..." }] }
    const review = await aiService(code, language); 
    res.status(200).json(review);
  } catch (error) {
    console.error("AI Controller Error:", error);
    res.status(500).json({
      review: [{ title: "Server Error", content: "An unexpected error occurred on the server while generating the review." }]
    });
  }
};

module.exports = { getReview };