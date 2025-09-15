const express = require('express');
const cors = require('cors');
const app = express();
const aiRoutes = require('./routes/ai.routes');

app.use(express.json());
app.use(cors());

// Use the aiRoutes for all requests to '/api'
app.use('/api', aiRoutes);

module.exports = app;