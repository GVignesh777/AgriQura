const mongoose = require('mongoose');

const expertQuerySchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
      required: true,
    },
    expert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    queryTitle: { type: String, required: true },
    queryDescription: { type: String, required: true },
    cropName: { type: String, default: '' },
    images: [{ type: String }],
    aiPreviousAnalysis: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Open', 'In Review', 'Resolved', 'Closed'],
      default: 'Open',
    },
    expertResponse: {
      advice: { type: String, default: '' },
      prescriptions: [{ type: String }],
      respondedAt: { type: Date },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ExpertQuery', expertQuerySchema);
