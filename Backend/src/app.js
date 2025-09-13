const express = require('express');
const cors = require('cors');
const aiRoutes = require('./routes/ai.routes');

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // your React frontend URL
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('hello world');
});

app.use('/ai', aiRoutes);

module.exports = app;
