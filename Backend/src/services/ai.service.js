// services/ai.service.js
const { GoogleGenAI } = require("@google/genai");

// Initialize Gemini client (API key is read from process.env.GOOGLE_GEMINI_KEY)
const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_GEMINI_KEY}); 

/**
 * Generates a code review using the Gemini API.
 * @param {string} code The code snippet to review.
 * @param {string} language The programming language of the code.
 * @returns {Promise<object>} The structured review object.
 */
async function generateReview(code, language) {
  // Use the provided language in the prompt for better contextual review
  const systemInstructions = `
You are a professional code reviewer. The user has provided a snippet in ${language}.
Analyze the code for:
1. Performance (efficiency, resource usage)
2. Readability (clarity, style, comments)
3. Security (vulnerabilities, best practices)
4. Suggestions (potential improvements, alternative methods)

Respond **ONLY in JSON** format, with no markdown fences (\`\`\`json) or any other surrounding text.
The JSON structure MUST be:
{
  "review": [
    {"title": "Performance", "content": "..."},
    {"title": "Readability", "content": "..."},
    {"title": "Security", "content": "..."},
    {"title": "Suggestions", "content": "..."}
  ]
}
Each 'content' field should contain a detailed, human-readable paragraph.
`;
    // Add language context to the prompt
    const userPrompt = `Review the following ${language} code:\n\n${code}`;
  
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            systemInstructions,
            contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        });

        const aiText = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        // Attempt to extract and parse JSON, accommodating potential markdown wrappers.
        const jsonMatch = aiText.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
            try {
                // Return the parsed JSON object
                return JSON.parse(jsonMatch[0]);
            } catch (err) {
                // If JSON parsing fails, return a formatted error
                return {
                    review: [
                        { title: "AI Response Error", content: `Failed to parse AI output as JSON. Raw response: ${aiText}` },
                    ],
                };
            }
        }

        // If no JSON structure found, return the entire response as an error.
        return {
            review: [
                { title: "AI Response Error", content: `AI did not return expected JSON format. Raw output: ${aiText}` },
            ],
        };
    } catch (error) {
        console.error("Gemini API Error:", error);
        // Return a verbose error to help the user debug API issues
        return {
            review: [
                { title: "API Call Failed", content: `There was a problem communicating with the AI service. Check server logs for details. Error: ${error.message}` },
            ],
        };
    }
}

module.exports = generateReview;