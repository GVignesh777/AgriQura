const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    sender: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    structuredResponse: {
      directAnswer: { type: String, default: '' },
      explanation: { type: String, default: '' },
      recommendedActions: [{ type: String }],
      preventionSteps: [{ type: String }],
      warnings: [{ type: String }],
      followUpQuestions: [{ type: String }],
      uncertaintyFlagged: { type: Boolean, default: false },
    },
    modelUsed: {
      type: String,
      default: 'llama-3.1-8b-instant',
    },
    audioUrl: {
      type: String,
      default: '',
    },
    feedback: {
      rating: { type: String, enum: ['helpful', 'unhelpful', null], default: null },
      comment: { type: String, default: '' },
      createdAt: { type: Date },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
