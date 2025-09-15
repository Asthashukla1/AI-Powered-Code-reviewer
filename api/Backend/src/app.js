const express = require("express");
const cors = require("cors");
const aiRoutes = require("./routes/ai.routes");

const app = express();

// Middlewares
app.use(
  cors({
    origin: "*", // Allow all origins since this is an API endpoint
  })
);
app.use(express.json());

// API Routes
app.use("/api", aiRoutes);

// Export the app for Vercel's serverless function
module.exports = app;