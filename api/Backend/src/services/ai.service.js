// services/ai.service.js
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_KEY });

async function generateReview(code) {
  const systemInstructions = `
You are a professional code reviewer. Respond **ONLY in JSON** with this structure:
{
  "review": [
    {"title": "Performance", "content": "..."},
    {"title": "Readability", "content": "..."},
    {"title": "Security", "content": "..."},
    {"title": "Suggestions", "content": "..."}
  ]
}
Do not include any other text.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    systemInstructions,
    contents: [{ role: "user", parts: [{ text: code }] }],
  });

  const aiText = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // Try to extract JSON first
  const jsonMatch = aiText.match(/\{[\s\S]*\}/);

  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (err) {
      // If JSON parsing fails, fallback to showing plain text
      return {
        review: [
          { title: "AI Review (Unformatted)", content: aiText },
        ],
      };
    }
  }

  // If no JSON found, just return the AI text
  return {
    review: [
      { title: "AI Review", content: aiText },
    ],
  };
}

module.exports = generateReview;
