// api/index.js
const serverless = require("serverless-http");
const app = require("./Backend/src/app");

// Export as a serverless function for Vercel
module.exports = serverless(app);
