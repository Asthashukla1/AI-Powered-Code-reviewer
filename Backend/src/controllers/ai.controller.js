const aiService = require('../services/ai.service');

/**
 * Handles code review requests by calling the AI service.
 * Expects 'code' (required) and 'language' (optional, defaults to 'javascript') in the request body.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getReview = async (req, res) => {
  try {
    // Destructure code and language from body, setting 'javascript' as default language
    const { code, language = 'javascript' } = req.body;
    
    if (!code) {
      // Return a proper 400 Bad Request if code is missing
      return res.status(400).json({
        review: [{ title: "Input Error", content: "Code content is required for review." }]
      });
    }

    // Pass both code and language to the service layer
    const review = await aiService(code, language);
    res.status(200).json(review);
  } catch (error) {
    console.error("AI Controller Error:", error);
    // Use a generic server error for uncaught exceptions
    res.status(500).json({
      review: [{ title: "Server Error", content: "An unexpected error occurred on the server while generating the review." }]
    });
  }
};

module.exports = { getReview };