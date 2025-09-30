import { useState, useCallback } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css"; // Dark theme
import axios from "axios";

// Prism language packs
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";

/**
 * Renders a single section of the AI Review.
 */
const ReviewSection = ({ section }) => (
  <div className="p-4 bg-gray-800 border border-gray-700 rounded-xl shadow-lg transition hover:shadow-xl hover:border-blue-600">
    <h3 className="font-bold text-lg text-blue-400 mb-2">{section.title}</h3>
    <p className="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed">
      {section.content}
    </p>
  </div>
);

export default function CodeReviewer() {
  const [code, setCode] = useState("");
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("javascript");

  const languageOptions = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
  ];

  // Request AI review
  const handleReview = useCallback(async () => {
    if (!code.trim()) return;

    setLoading(true);
    setReview(null);

    const backendEndpoint = "/ai/review";

    try {
      const { data } = await axios.post(backendEndpoint, { code, language });
      setReview(
        Array.isArray(data.review) && data.review.length > 0
          ? data.review
          : [{ title: "AI Response", content: "No structured review was returned." }]
      );
    } catch (err) {
      console.error("API Error:", err);
      const errorMessage =
        err.response?.data?.review?.[0]?.content ||
        err.message ||
        "Failed to connect to the server.";
      setReview([{ title: "Request Failed", content: `Error: ${errorMessage}` }]);
    } finally {
      setLoading(false);
    }
  }, [code, language]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900 shadow-md">
        <h1 className="text-3xl font-extrabold text-blue-500">
          Gemini Code Reviewer 🤖
        </h1>
        <a
          href="https://ai.google.dev/gemini-api/docs/api-key"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
        >
          Get a Gemini API Key
        </a>
      </header>

      {/* Main Section */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        {/* Left: Code Editor */}
        <div className="flex flex-col p-6 border-r border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-blue-400">Code Editor</h2>

            {/* Language dropdown */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 cursor-pointer hover:border-blue-500 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              {languageOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Editor with line numbers */}
          <div className="relative flex-1 min-h-[400px]">
            {/* Line Numbers */}
            <div
              className="absolute top-0 left-0 bottom-0 w-10 text-right pr-2 pt-5 text-gray-600 font-mono text-xs select-none"
              style={{ lineHeight: "1.6" }}
            >
              {code.split("\n").map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Editor */}
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={(inputCode) => {
                const grammar = Prism.languages[language] || Prism.languages.clike;
                return Prism.highlight(inputCode, grammar, language);
              }}
              className="editor-wrapper w-full h-full font-mono text-sm bg-gray-800 text-gray-200 border border-gray-700 rounded-xl focus:outline-none overflow-auto shadow-inner"
              placeholder={`Paste your ${language} code here...`}
              style={{
                fontFamily: '"Fira Code", "Consolas", monospace',
                fontSize: 14,
                tabSize: 2,
                lineHeight: "1.6",
                minHeight: "100%",
                padding: "20px 20px 20px 50px", // Left padding for gutter
              }}
            />
          </div>

          {/* Review Button */}
          <button
            onClick={handleReview}
            disabled={loading || !code.trim()}
            className="mt-6 w-full py-3 rounded-xl font-bold transition-all duration-200 ease-in-out
                       bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30
                       disabled:bg-gray-700 disabled:shadow-none disabled:text-gray-400
                       flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Reviewing Code...</span>
              </>
            ) : (
              <span>Review Code</span>
            )}
          </button>
        </div>

        {/* Right: AI Review Section */}
        <div className="flex flex-col p-6 overflow-y-auto bg-gray-900">
          <h2 className="text-2xl font-semibold mb-6 text-green-400 border-b border-gray-700 pb-2">
            AI Review & Feedback
          </h2>
          <div className="flex-1 space-y-6">
            {review === null && !loading && (
              <div className="p-6 bg-gray-800 border border-gray-700 rounded-xl text-center">
                <p className="text-gray-400 italic">
                  Enter your code on the left and click **Review Code** to get AI feedback.
                </p>
              </div>
            )}

            {review &&
              review.length > 0 &&
              review.map((section, idx) => <ReviewSection key={idx} section={section} />)}

            {loading && (
              <div className="p-6 text-center text-blue-400">
                <p className="font-medium">Waiting for AI response, please wait...</p>
              </div>
            )}

            {review && review.length === 0 && !loading && (
              <div className="p-6 bg-gray-800 border border-red-500 rounded-xl text-center">
                <p className="text-red-400">
                  Failed to retrieve or parse review content. Check the server console for errors.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-3 border-t border-gray-800 text-center text-xs text-gray-500 bg-gray-900">
        Powered by Google Gemini API.
      </footer>
    </div>
  );
}
