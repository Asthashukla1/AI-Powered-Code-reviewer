const express = require('express');
const router = express.Router();
// Use object destructuring for clean import
const { getReview } = require('../controllers/ai.controller');

router.post('/review', getReview);

module.exports = router;