const express = require("express");
const cors = require("cors");
const aiRoutes = require("./routes/ai.routes");

const app = express();

// Middlewares
app.use(
  cors({
    origin: "*", // Allow requests from all origins in production
  })
);
app.use(express.json());

// API Routes
app.use("/api", aiRoutes);

module.exports = app;