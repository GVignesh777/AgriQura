const mongoose = require('mongoose');

const diseaseDetectionSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
      required: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Disease image URL is required'],
    },
    cropName: {
      type: String,
      default: 'Unknown Crop',
    },
    detectedDisease: {
      type: String,
      required: true,
    },
    confidenceScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    symptoms: [{ type: String }],
    causes: [{ type: String }],
    recommendedActions: [{ type: String }],
    preventionSteps: [{ type: String }],
    chemicalTreatment: [{ type: String }],
    organicTreatment: [{ type: String }],
    disclaimer: {
      type: String,
      default: 'AI-assisted screening only — not a certified laboratory diagnosis.',
    },
    escalatedToExpert: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DiseaseDetection', diseaseDetectionSchema);
