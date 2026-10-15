const mongoose = require('mongoose');
const Conversation = require('../database/models/Conversation');
const Message = require('../database/models/Message');
const Memory = require('../database/models/Memory');
const Farmer = require('../database/models/Farmer');
const Farm = require('../database/models/Farm');
const { streamGroqCompletion } = require('../services/groqClient');

/**
 * @desc    Stream AI Chat response (SSE)
 * @route   POST /api/assistant/chat/stream
 */
exports.streamChat = async (req, res, next) => {
  try {
    const { conversationId, userMessage, farmId, language } = req.body;

    if (!userMessage) {
      return res.status(400).json({ success: false, error: 'User message is required' });
    }

    // Set SSE Headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let conversation;
    if (conversationId && mongoose.Types.ObjectId.isValid(conversationId)) {
      conversation = await Conversation.findOne({ _id: conversationId, user: req.user.id });
    }

    if (!conversation) {
      conversation = await Conversation.create({
        user: req.user.id,
        title: userMessage.slice(0, 40) + '...',
        farmContext: farmId || null,
      });
    }

    // Save User Message
    await Message.create({
      conversation: conversation._id,
      sender: 'user',
      content: userMessage,
    });

    // Check if user explicitly instructed AI to remember/store a detail in long-term memory
    const memoryRegex = /(?:remember\s+(?:that\s+)?|store\s+in\s+memory[:\s]+|save\s+to\s+memory[:\s]+|keep\s+in\s+memory[:\s]+|గుర్తుంచుకో[:\s]+|యాద్\s+రఖో[:\s]+|याद\s+रखो[:\s]+)(.+)/i;
    const memMatch = userMessage.match(memoryRegex);
    if (memMatch && memMatch[1]) {
      const rawMem = memMatch[1].trim();
      if (rawMem.length > 3) {
        try {
          await Memory.create({
            user: req.user.id,
            key: rawMem.length > 35 ? rawMem.slice(0, 35) + '...' : rawMem,
            content: rawMem,
            category: 'custom_note',
            source: 'explicit_user',
          });
        } catch (memErr) {
          console.warn('⚠️ [Auto Memory Save Error]:', memErr.message);
        }
      }
    }

    // Fetch Farmer Profile, Active Farm & Saved Long-term Memories
    const farmerProfile = await Farmer.findOne({ user: req.user.id });
    let activeFarm = null;

    if (farmId) {
      activeFarm = await Farm.findById(farmId);
    } else {
      activeFarm = await Farm.findOne({ farmer: farmerProfile?._id, status: 'Active' });
    }

    const savedMemories = await Memory.find({ user: req.user.id }).sort({ createdAt: -1 });

    const farmerContext = {
      farmerName: req.user.name,
      state: farmerProfile?.state || 'Telangana',
      district: farmerProfile?.district || 'Warangal',
      farmSizeAcres: activeFarm?.areaAcres || farmerProfile?.landSizeAcres || 2,
      currentCrop: activeFarm?.crop || farmerProfile?.primaryCrops?.[0] || 'Cotton',
      cropStage: activeFarm?.cropStage || 'Flowering',
      soilType: activeFarm?.soilType || farmerProfile?.soilType || 'Black Soil',
      irrigationType: activeFarm?.irrigationType || 'Drip',
      weatherSummary: '30°C, 65% Humidity',
      language: language || req.user.preferredLanguage || 'en',
      memories: savedMemories,
    };

    // Fetch previous conversation messages
    const pastMessages = await Message.find({ conversation: conversation._id })
      .sort({ createdAt: 1 })
      .limit(10);

    // Stream Groq response to client
    await streamGroqCompletion({
      messages: pastMessages,
      farmerContext,
      res,
      useStrongModel: false,
    });

    // Update Conversation timestamp
    conversation.lastMessageAt = new Date();
    await conversation.save();
  } catch (error) {
    console.error('❌ [Stream Chat Error]:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: 'Streaming failed' });
    }
  }
};

/**
 * @desc    Get user conversations
 * @route   GET /api/assistant/conversations
 */
exports.getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ user: req.user.id })
      .sort({ lastMessageAt: -1 })
      .limit(25);

    res.status(200).json({ success: true, count: conversations.length, conversations });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get messages for a conversation
 * @route   GET /api/assistant/conversations/:id/messages
 */
exports.getConversationMessages = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(200).json({ success: true, count: 0, messages: [] });
    }

    const conversation = await Conversation.findOne({ _id: req.params.id, user: req.user.id });
    if (!conversation) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }

    const messages = await Message.find({ conversation: conversation._id }).sort({ createdAt: 1 });

    res.status(200).json({ success: true, count: messages.length, messages });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a specific conversation
 * @route   DELETE /api/assistant/conversations/:id
 */
exports.deleteConversation = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(200).json({ success: true, message: 'Conversation deleted' });
    }

    await Message.deleteMany({ conversation: req.params.id });
    await Conversation.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    res.status(200).json({ success: true, message: 'Conversation deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit feedback on AI response
 * @route   POST /api/assistant/messages/:id/feedback
 */
exports.submitMessageFeedback = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }

    message.feedback = {
      rating,
      comment: comment || '',
      createdAt: new Date(),
    };
    await message.save();

    res.status(200).json({ success: true, message: 'Feedback recorded', feedback: message.feedback });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all long-term memories for logged-in farmer
 * @route   GET /api/assistant/memories
 */
exports.getMemories = async (req, res, next) => {
  try {
    const memories = await Memory.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: memories.length, memories });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new long-term memory manually
 * @route   POST /api/assistant/memories
 */
exports.createMemory = async (req, res, next) => {
  try {
    const { key, content, category } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, error: 'Memory content is required' });
    }

    const memory = await Memory.create({
      user: req.user.id,
      key: (key || content.slice(0, 30)).trim(),
      content: content.trim(),
      category: category || 'custom_note',
      source: 'manual_ui',
    });

    res.status(201).json({ success: true, message: 'Memory saved successfully', memory });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a specific long-term memory
 * @route   DELETE /api/assistant/memories/:id
 */
exports.deleteMemory = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, error: 'Invalid memory ID' });
    }

    const memory = await Memory.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!memory) {
      return res.status(404).json({ success: false, error: 'Memory not found' });
    }

    res.status(200).json({ success: true, message: 'Memory deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Clear all long-term memories for user
 * @route   DELETE /api/assistant/memories
 */
exports.clearMemories = async (req, res, next) => {
  try {
    await Memory.deleteMany({ user: req.user.id });
    res.status(200).json({ success: true, message: 'All memories cleared successfully' });
  } catch (error) {
    next(error);
  }
};
