import { useState } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css"; // Dark theme
import axios from "axios";

// Prism language packs
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-clike"; // required
import "prismjs/components/prism-c";     // required
import "prismjs/components/prism-cpp";

export default function CodeReviewer() {
  const [code, setCode] = useState("");
  const [review, setReview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("javascript");

  const handleReview = async () => {
  if (!code.trim()) return;
  setLoading(true);

  try {
    const { data } = await axios.post("/api/review", { code, language });
    setReview(
      data.review || [{ title: "AI Review", content: "No response from server" }]
    );
  } catch (err) {
    console.error(err);
    setReview([{ title: "AI Review", content: "Failed to fetch review" }]);
  }

  setLoading(false);
};


  return (
    <div className="h-screen w-screen grid grid-cols-2 bg-gray-900 text-gray-200">
      {/* Left: Code Editor */}
      <div className="flex flex-col p-4 border-r border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-blue-400">Your Code</h2>

          {/* Language dropdown */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="ml-4 px-2 py-1 rounded bg-gray-800 border border-gray-600 text-gray-200"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>

        <div className="relative flex-1">
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={(inputCode) =>
              Prism.highlight(inputCode, Prism.languages[language], language)
            }
            padding={10}
            className="editor-with-lines w-full h-full font-mono text-sm bg-gray-800 text-gray-200 border border-gray-600 rounded-lg focus:outline-none overflow-auto"
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
                <h3 className="font-semibold text-blue-300 mb-1">
                  {section.title}
                </h3>
                <pre className="whitespace-pre-wrap text-gray-200">
                  {section.content}
                </pre>
              </div>
            ))
          ) : (
            <p className="text-gray-400">AI feedback will appear here...</p>
          )}
        </div>
      </div>

      {/* Custom CSS for line numbers */}
      <style>{`
        .editor-with-lines {
          counter-reset: line;
          padding-left: 3em; /* space for line numbers */
          white-space: pre-wrap;
        }

        .editor-with-lines pre {
          position: relative;
        }

        .editor-with-lines pre code {
          counter-reset: line;
        }

        .editor-with-lines pre code span {
          display: block;
          counter-increment: line;
        }

        .editor-with-lines pre code span::before {
          content: counter(line);
          display: inline-block;
          width: 2em;
          margin-right: 1em;
          text-align: right;
          color: #555;
          user-select: none;
        }
      `}</style>
    </div>
  );
}
