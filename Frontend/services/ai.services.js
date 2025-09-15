// /services/ai.service.js
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_KEY });

export default async function generateReview(code) {
  const systemInstructions = `
You are a professional code reviewer. Respond ONLY in JSON like:
{
  "review": [
    {"title": "Performance", "content": "..."},
    {"title": "Readability", "content": "..."},
    {"title": "Security", "content": "..."},
    {"title": "Suggestions", "content": "..."}
  ]
}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    systemInstructions,
    contents: [{ role: "user", parts: [{ text: code }] }],
  });

  let aiText = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  const jsonMatch = aiText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return {
      review: [{ title: "Error", content: "AI returned invalid JSON." }],
    };
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    return {
      review: [{ title: "Error", content: "Could not parse AI response." }],
    };
  }
}
