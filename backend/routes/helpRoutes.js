const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../database/models/User');
const { protect } = require('../middleware/auth');
const {
  getCategories,
  getFaqs,
  getResources,
  reportProblem,
  getHelpHistory,
  getNearbyServices,
} = require('../controllers/helpController');

// Optional auth middleware for guest / logged-in problem reports
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, env.jwtSecret);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (e) {
      // Ignore token decode errors for guest requests
    }
  }
  next();
};

router.get('/categories', getCategories);
router.get('/faqs', getFaqs);
router.get('/resources', getResources);
router.post('/report', optionalAuth, reportProblem);
router.get('/history', protect, getHelpHistory);
router.get('/services', getNearbyServices);

module.exports = router;
