const express = require('express');
const router = express.Router();
const { submitFeedback, getAnalytics } = require('../controllers/feedbackController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

router.post('/', protect, submitFeedback);
router.get('/analytics', protect, authorize('Admin', 'Expert'), getAnalytics);

module.exports = router;
