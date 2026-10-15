const mongoose = require('mongoose');

const consentRecordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    consentType: {
      type: String,
      enum: ['DataPrivacy', 'LocationAccess', 'NotificationAlerts', 'ThirdPartyShare'],
      required: true,
    },
    isGranted: { type: Boolean, required: true },
    ipAddress: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    grantedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ConsentRecord', consentRecordSchema);
