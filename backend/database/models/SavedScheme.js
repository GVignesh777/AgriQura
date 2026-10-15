const mongoose = require('mongoose');

const savedSchemeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    schemeId: { type: String, required: true, index: true },
    schemeName: { type: String, required: true },
    category: { type: String },
    state: { type: String, default: 'All' },
    governmentLevel: { type: String, default: 'Central' },
    applicationStatus: {
      type: String,
      enum: [
        'Interested',
        'Preparing Documents',
        'Application Started',
        'Submitted',
        'Under Review',
        'Approved',
        'Rejected'
      ],
      default: 'Interested',
      index: true
    },
    personalNotes: { type: String, default: '' },
    applicationUrl: { type: String, default: '' },
    documentsGathered: [{ type: String }],
    submissionDate: { type: Date, default: null },
    reminderDate: { type: Date, default: null }
  },
  { timestamps: true }
);

savedSchemeSchema.index({ userId: 1, schemeId: 1 }, { unique: true });

module.exports = mongoose.model('SavedScheme', savedSchemeSchema);
