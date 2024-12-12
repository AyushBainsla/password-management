const express = require('express');
const router = express.Router();
const { getUserAnalytics } = require('../controllers/analyticsController');

// Get user analytics
router.get('/', getUserAnalytics);

module.exports = router;
