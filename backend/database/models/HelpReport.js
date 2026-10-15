const mongoose = require('mongoose');

const helpReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    farmerName: {
      type: String,
      default: 'Guest Farmer',
    },
    contactPhone: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: [
        'AI Response',
        'Crop Information',
        'Market Price',
        'Weather',
        'Voice Assistant',
        'Login/Account',
        'Technical Issue',
        'Other',
      ],
      required: [true, 'Please select a problem category'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description'],
      minlength: [10, 'Description must be at least 10 characters long'],
    },
    screenshot: {
      type: String,
      default: null, // Base64 data URL or uploaded URL
    },
    location: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
      default: 'Open',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    resolutionNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('HelpReport', helpReportSchema);
