const express = require('express');
const router = express.Router();
const {
  streamChat,
  getConversations,
  getConversationMessages,
  deleteConversation,
  submitMessageFeedback,
  getMemories,
  createMemory,
  deleteMemory,
  clearMemories,
} = require('../controllers/assistantController');
const { protect } = require('../middleware/auth');

// Chat streaming & history
router.post('/chat/stream', protect, streamChat);
router.get('/conversations', protect, getConversations);
router.get('/conversations/:id/messages', protect, getConversationMessages);
router.delete('/conversations/:id', protect, deleteConversation);
router.post('/messages/:id/feedback', protect, submitMessageFeedback);

// Long-Term Memory Endpoints (ChatGPT / Gemini style)
router.get('/memories', protect, getMemories);
router.post('/memories', protect, createMemory);
router.delete('/memories/:id', protect, deleteMemory);
router.delete('/memories', protect, clearMemories);

module.exports = router;
