// Backend/src/services/ai.service.js - Corrected & JSON-Enforced

const { GoogleGenAI } = require("@google/genai");

// Singleton AI client
let ai = null;

/**
 * Initialize the Gemini AI client.
 */
function initAI() {
  if (!ai) {
    if (!process.env.GOOGLE_GEMINI_KEY) {
      throw new Error("GOOGLE_GEMINI_KEY is missing in .env");
    }
    ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_KEY });
  }
  return ai;
}

/**
 * Generates a code review using the Gemini API.
 * @param {string} code The code snippet to review.
 * @param {string} language The programming language of the code.
 * @returns {Promise<object>} The structured review object.
 */
async function generateReview(code, language) {
  const aiClient = initAI();

 const systemInstructions = `
You are a professional code reviewer.
The user will provide a short JavaScript snippet (3-5 lines).
Return ONLY a JSON object, in this exact format:

{
  "issues": ["list of issues here"],
  "suggestions": ["list of improvements here"],
  "fixedCode": "corrected code snippet as string"
}

Do NOT include explanations, markdown, or any text outside JSON.
`;


  const userPrompt = `Review the following ${language} code:\n\n${code}`;

  try {
    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      systemInstruction: systemInstructions,
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: {
        responseMimeType: "application/json", // force JSON output
      },
    });

    const aiText = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    try {
      // Parse JSON directly
      return JSON.parse(aiText);
    } catch (jsonErr) {
      console.error("JSON Parsing Error:", jsonErr);
      return {
        review: [
          {
            title: "AI Response Error",
            content: `AI returned invalid JSON. Raw response: ${aiText}`,
          },
        ],
      };
    }
  } catch (apiErr) {
    console.error("Gemini API Error:", apiErr);
    return {
      review: [
        {
          title: "API Call Failed",
          content: `There was a problem communicating with the AI service. Check server logs for details. Error: ${apiErr.message}`,
        },
      ],
    };
  }
}

module.exports = generateReview;
