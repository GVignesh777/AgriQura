const express = require('express');
const router = express.Router();
const voiceController = require('../controllers/voiceController');

// POST /api/voice/tts - Unified Text-To-Speech Synthesis
router.post('/tts', voiceController.synthesizeSpeech);

// POST /api/voice/intent - Groq AI Natural Language Intent Extraction Fallback
router.post('/intent', voiceController.extractIntent);

module.exports = router;
