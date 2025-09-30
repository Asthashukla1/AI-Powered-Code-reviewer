// Backend/src/services/ai.service.js - Definitive Fix

const { GoogleGenAI } = require("@google/genai");

// Use a variable to hold the initialized client. Set to null initially.
let ai = null; 

/**
 * Generates a code review using the Gemini API.
 * @param {string} code The code snippet to review.
 * @param {string} language The programming language of the code.
 * @returns {Promise<object>} The structured review object.
 */
async function generateReview(code, language) {
  // FIX: Initialize the client only if it hasn't been done yet.
  // This ensures the client is instantiated AFTER dotenv has run in server.js.
  if (!ai) {
    try {
      // Explicitly pass the API key from the environment variable 
      ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_KEY }); 
      
      if (!process.env.GOOGLE_GEMINI_KEY) {
        throw new Error("GOOGLE_GEMINI_KEY is missing from environment variables.");
      }
    } catch (initError) {
        console.error("AI Service Initialization Error:", initError);
        // Throw the error to be caught by the controller's main try/catch block
        throw new Error("API service failed to initialize. Check GOOGLE_GEMINI_KEY in .env");
    }
  }

  const systemInstructions = `
You are a professional code reviewer. The user has provided a snippet in ${language}.
Analyze the code for:
// ... (rest of system instructions are the same)
`;
  // ... (rest of the generateContent call and parsing logic remains the same)

  const userPrompt = `Review the following ${language} code:\n\n${code}`;
  
  try {
      const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          systemInstructions,
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      });

      const aiText = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // Attempt to extract and parse JSON, accommodating potential wrapping issues.
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
          try {
              // Return the parsed JSON object
              return JSON.parse(jsonMatch[0]);
          } catch (err) {
              console.error("JSON Parsing Error:", err);
              return {
                  review: [
                      { title: "AI Response Error", content: `AI returned invalid JSON. Raw response: ${aiText}` },
                  ],
              };
          }
      }

      return {
          review: [
              { title: "AI Response Error", content: `AI did not return expected JSON format. Raw output: ${aiText}` },
          ],
      };
  } catch (error) {
      console.error("Gemini API Error:", error);
      return {
          review: [
              { title: "API Call Failed", content: `There was a problem communicating with the AI service. Check server logs for details. Error: ${error.message}` },
          ],
      };
  }
}

module.exports = generateReview;