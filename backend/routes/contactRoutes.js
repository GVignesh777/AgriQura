const express = require('express');
const router = express.Router();
const {
  submitContactMessage,
  getTicketStatus
} = require('../controllers/contactController');

router.post('/', submitContactMessage);
router.get('/status/:id', getTicketStatus);

module.exports = router;
