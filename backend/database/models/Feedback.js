const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
    rating: {
      type: String,
      enum: ['helpful', 'unhelpful'],
      required: true,
    },
    category: {
      type: String,
      enum: ['AI Assistant', 'Disease Detection', 'Weather Advice', 'Market Price', 'General UI'],
      default: 'AI Assistant',
    },
    comment: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
