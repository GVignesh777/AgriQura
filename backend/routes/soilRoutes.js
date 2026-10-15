const express = require('express');
const router = express.Router();
const { analyzeSoil, getReports } = require('../controllers/soilController');
const { protect } = require('../middleware/auth');

router.post('/analyze', protect, analyzeSoil);
router.get('/', protect, getReports);

module.exports = router;
