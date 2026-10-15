const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema(
  {
    schemeId: { type: String, required: true, unique: true, index: true, trim: true },
    name: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    governmentLevel: {
      type: String,
      enum: ['Central', 'State'],
      required: true,
      default: 'Central',
      index: true
    },
    state: { type: String, required: true, default: 'All', index: true },
    ministry: { type: String, default: 'Ministry of Agriculture & Farmers Welfare' },
    department: { type: String, default: 'Department of Agriculture & Cooperation' },
    category: {
      type: String,
      required: true,
      index: true
    },
    targetNeeds: [{ type: String }],
    crops: [{ type: String, index: true }],
    farmerTypes: [{ type: String, index: true }],
    benefits: {
      summary: { type: String },
      amountText: { type: String },
      details: [{ type: String }]
    },
    eligibility: {
      summary: { type: String },
      criteria: [{ type: String }],
      minLandAcres: { type: Number, default: 0 },
      maxLandAcres: { type: Number, default: null },
      applicableStates: [{ type: String }]
    },
    requiredDocuments: [{ type: String }],
    applicationProcess: [{
      stepNumber: { type: Number },
      title: { type: String },
      description: { type: String }
    }],
    applicationUrl: { type: String, default: '' },
    officialSource: { type: String, default: 'Government of India' },
    sourcePortal: { type: String, default: 'myScheme.gov.in' },
    lastUpdated: { type: String, default: '2026-02-15' },
    syncedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['Active', 'Upcoming', 'Closed'], default: 'Active' },
    importantDates: {
      launchYear: { type: Number },
      applicationDeadline: { type: String, default: 'Open Throughout the Year' }
    }
  },
  { timestamps: true }
);

schemeSchema.index({ state: 1, category: 1, governmentLevel: 1 });
schemeSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Scheme', schemeSchema);
