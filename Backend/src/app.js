const express = require("express");
const cors = require("cors");
const path = require("path");
const aiRoutes = require("./routes/ai.routes");

const app = express();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173", // React dev server
  })
);
app.use(express.json());

// Serve static files from Vite build
app.use(express.static(path.join(__dirname, "../Frontend/dist")));

// API Routes
app.use("/ai", aiRoutes);

// Test API
app.get("/api/hello", (req, res) => {
  res.send("Hello World from Backend 🚀");
});

// Catch-all (for React Router) ✅ Express 5 FIX
app.use((req, res, next) => {
  res.sendFile(path.resolve(__dirname, "../Frontend/dist", "index.html"));
});

module.exports = app;
