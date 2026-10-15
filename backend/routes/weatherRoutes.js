const express = require('express');
const router = express.Router();
const {
  getForecast,
  getCurrent,
  getHourly,
  getDaily,
  getAlerts,
  geocode,
  getAIAdvisory,
} = require('../controllers/weatherController');

// Main forecast endpoint
router.get('/', getForecast);
router.get('/forecast', getForecast);

// Granular sub-endpoints
router.get('/current', getCurrent);
router.get('/hourly', getHourly);
router.get('/daily', getDaily);
router.get('/alerts', getAlerts);

// Location geocoding search
router.get('/geocode', geocode);

// Groq AI Weather Interpretation
router.post('/ai-advisory', getAIAdvisory);

module.exports = router;
