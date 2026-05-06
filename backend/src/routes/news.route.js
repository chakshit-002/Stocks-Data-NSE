const express = require('express');
const router = express.Router();
const { getStockNews } = require('../controllers/news.controller');
const { protect } = require('../middlewares/auth.middleware');

// Protect middleware lagane se bina login ke news fetch nahi hogi
router.get('/:symbol', protect, getStockNews);

module.exports = router;