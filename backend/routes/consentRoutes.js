const express = require('express');
const router = express.Router();
const { recordConsent } = require('../controllers/consentController');
const { protect } = require('../middleware/auth');

router.post('/', protect, recordConsent);

module.exports = router;
