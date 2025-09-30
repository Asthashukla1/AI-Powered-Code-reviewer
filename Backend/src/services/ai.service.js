// services/ai.service.js
const { GoogleGenAI } = require("@google/genai");

let aiClient = null;

function initializeClient() {
    if (aiClient) {
        return aiClient;
    }
    
    const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_KEY;

    if (!GEMINI_API_KEY) {
        console.error("--- CRITICAL CONFIG ERROR ---");
        console.error("GOOGLE_GEMINI_KEY environment variable is NOT SET.");
        console.error("The AI service cannot authenticate.");
        console.error("-----------------------------");
        throw new Error("API service failed to initialize due to missing GOOGLE_GEMINI_KEY.");
    }
    
    aiClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    return aiClient;
}


/**
 * Generates a code review using the Gemini API, returning plain, human-readable text.
 */
async function generateReview(code, language) {
  try {
    const ai = initializeClient(); 
    
    // FIX: Simplified and updated prompt to request PLAIN TEXT, concise summary
    const systemInstructions = `
You are a professional code reviewer. The user has provided a snippet in ${language}.
Analyze the code for four sections: Performance, Readability, Security, and Suggestions.
Provide a clear, concise, and professional code review. 
Your entire output should be a single human-readable text block. 
Use clear markdown headings (##) for each section and brief, concise bullet points for feedback.
Do NOT include any JSON, YAML, XML, or code fences (\`\`\`) in your final output.
`;
    const userPrompt = `Review the following ${language} code:\n\n${code}`;
  
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash", 
        systemInstructions,
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    });

    const aiText = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // The output is already plain text, return it wrapped in a simple object for the controller
    return {
        // We use a single 'review' field to hold the entire plain text output
        review: [
            { title: "Full AI Code Review", content: aiText },
        ],
    };

  } catch (error) {
      console.error("Gemini API Error (Caught):", error.message);
      return {
          review: [
              { title: "Service Unavailable", content: `A critical service error occurred. Check your backend console for details. Error: ${error.message}` },
          ],
      };
  }
}

module.exports = generateReview;