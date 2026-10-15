const express = require('express');
const router = express.Router();
const { analyzeDiseaseImage, getHistory } = require('../controllers/diseaseController');
const { protect } = require('../middleware/auth');

router.post('/analyze', protect, analyzeDiseaseImage);
router.get('/history', protect, getHistory);

module.exports = router;
