import { useState } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css"; // Dark theme
import axios from "axios";
import "prismjs/components/prism-javascript"; // Ensure JS syntax highlighting

export default function CodeReviewer() {
  const [code, setCode] = useState("");
  const [review, setReview] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleReview = async () => {
    if (!code.trim()) return;
    setLoading(true);

    try {
      const { data } = await axios.post("http://localhost:5000/ai/review", { code });
      setReview(data.review || [{ title: "AI Review", content: "No response from server" }]);
    } catch (err) {
      console.error(err);
      setReview([{ title: "AI Review", content: "Failed to fetch review" }]);
    }

    setLoading(false);
  };

  const highlightCode = (code) =>
    Prism.highlight(code, Prism.languages.javascript, "javascript");

  return (
    <div className="h-screen w-screen grid grid-cols-2 bg-gray-900 text-gray-200">
      {/* Left: Code Editor */}
      <div className="flex flex-col p-4 border-r border-gray-700">
        <h2 className="text-xl font-semibold mb-2 text-blue-400">Your Code</h2>
        <div className="relative flex-1">
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={highlightCode}
            padding={10}
            className="w-full h-full font-mono text-sm bg-gray-800 text-gray-200 border border-gray-600 rounded-lg focus:outline-none overflow-auto"
            placeholder="Paste your code here..."
            style={{
              fontFamily: '"Fira Code", monospace',
              fontSize: 14,
              tabSize: 2,
              lineHeight: "1.5",
            }}
          />
        </div>
        <button
          onClick={handleReview}
          disabled={loading || !code.trim()}
          className="mt-3 self-end px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white disabled:bg-gray-600"
        >
          {loading ? "Reviewing..." : "Review Code"}
        </button>
      </div>

      {/* Right: AI Review */}
      <div className="flex flex-col p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-blue-400">AI Review</h2>
        <div className="flex-1 space-y-4">
          {review.length > 0 ? (
            review.map((section, idx) => (
              <div
                key={idx}
                className="p-3 bg-gray-800 border border-gray-700 rounded-lg shadow-sm hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-blue-300 mb-1">{section.title}</h3>
                <pre className="whitespace-pre-wrap text-gray-200">{section.content}</pre>
              </div>
            ))
          ) : (
            <p className="text-gray-400">AI feedback will appear here...</p>
          )}
        </div>
      </div>
    </div>
  );
}
