// services/ai.services.js
import axios from "axios";

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

  try {
    const response = await axios.post("/api/review", { code });
    let aiText = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        review: [{ title: "Error", content: "AI returned invalid JSON." }],
      };
    }
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("API call failed:", error);
    return {
      review: [{ title: "Error", content: "Failed to connect to the backend." }],
    };
  }
}