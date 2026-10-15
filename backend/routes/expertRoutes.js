const express = require('express');
const router = express.Router();
const { createExpertQuery, getExpertQueries, respondToQuery } = require('../controllers/expertController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

router.post('/', protect, createExpertQuery);
router.get('/', protect, getExpertQueries);
router.put('/:id/respond', protect, authorize('Expert', 'Admin'), respondToQuery);

module.exports = router;
