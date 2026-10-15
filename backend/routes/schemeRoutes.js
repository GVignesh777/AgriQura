const express = require('express');
const router = express.Router();
const {
  getSchemes,
  getSchemeById,
  getStates,
  getCategories,
  matchSchemes,
  explainSchemeAI,
  getSavedSchemes,
  saveScheme,
  updateApplicationStatus,
  removeSavedScheme,
  getSyncStatus
} = require('../controllers/schemeController');
const { protect } = require('../middleware/auth');

// Public Scheme Endpoints
router.get('/', getSchemes);
router.get('/states', getStates);
router.get('/categories', getCategories);
router.get('/sync-status', getSyncStatus);
router.post('/match', matchSchemes);
router.post('/explain-ai', explainSchemeAI);

// Farmer Saved Schemes & Application Tracker (Protected)
router.get('/saved', protect, getSavedSchemes);
router.post('/saved', protect, saveScheme);
router.patch('/saved/:id', protect, updateApplicationStatus);
router.delete('/saved/:id', protect, removeSavedScheme);

// Get single scheme by ID (keep after specific endpoints to avoid route conflict)
router.get('/:id', getSchemeById);

module.exports = router;
