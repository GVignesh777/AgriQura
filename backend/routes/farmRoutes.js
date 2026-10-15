const express = require('express');
const router = express.Router();
const { getFarms, addFarm, updateFarm, deleteFarm } = require('../controllers/farmController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getFarms);
router.post('/', protect, addFarm);
router.put('/:id', protect, updateFarm);
router.delete('/:id', protect, deleteFarm);

module.exports = router;
