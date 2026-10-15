const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    key: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    category: {
      type: String,
      enum: ['farm_detail', 'crop_preference', 'soil_data', 'equipment', 'custom_note', 'general'],
      default: 'general',
    },
    source: {
      type: String,
      enum: ['explicit_user', 'auto_learned', 'manual_ui'],
      default: 'explicit_user',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Memory', memorySchema);
