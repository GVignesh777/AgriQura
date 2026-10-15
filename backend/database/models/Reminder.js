const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
      required: true,
    },
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    dueDate: { type: Date, required: true },
    reminderType: {
      type: String,
      enum: ['Irrigation', 'Fertilizer', 'PestInspection', 'HarvestPrep', 'GeneralTask'],
      default: 'GeneralTask',
    },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reminder', reminderSchema);
