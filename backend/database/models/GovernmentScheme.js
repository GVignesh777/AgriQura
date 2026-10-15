const mongoose = require('mongoose');

const governmentSchemeSchema = new mongoose.Schema(
  {
    schemeName: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    category: {
      type: String,
      enum: ['Financial Support', 'Crop Insurance', 'Irrigation', 'Soil Health', 'Subsidies', 'Equipment', 'Organic Farming'],
      required: true,
    },
    state: { type: String, default: 'All' },
    eligibilityCriteria: [{ type: String }],
    benefits: [{ type: String }],
    requiredDocuments: [{ type: String }],
    applicationSteps: [{ type: String }],
    officialSourceUrl: { type: String, default: '' },
    deadlineDate: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GovernmentScheme', governmentSchemeSchema);
