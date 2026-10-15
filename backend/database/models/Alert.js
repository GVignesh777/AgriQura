const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
      required: true,
    },
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      default: null,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['Weather', 'PestRisk', 'Irrigation', 'Market', 'FertilizerDue', 'SchemeDeadline'],
      required: true,
    },
    severity: {
      type: String,
      enum: ['Info', 'Moderate', 'High', 'Critical'],
      default: 'Moderate',
    },
    isRead: { type: Boolean, default: false },
    actionUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Alert', alertSchema);
