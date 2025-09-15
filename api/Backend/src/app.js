const express = require("express");
const cors = require("cors");
const aiRoutes = require("./routes/ai.routes");

const app = express();

// Middlewares
app.use(
  cors({
    origin: "*", 
  })
);
app.use(express.json());

// API Routes
// Remove the '/api' prefix here
app.use("/", aiRoutes);

module.exports = app;