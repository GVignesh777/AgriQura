const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      default: '',
      trim: true
    },
    userType: {
      type: String,
      enum: [
        'Farmer',
        'Student',
        'Agricultural Professional',
        'Government/Institution',
        'Partner/Organization',
        'General User',
        'Other'
      ],
      default: 'Farmer'
    },
    category: {
      type: String,
      default: 'General Inquiry'
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
      maxlength: [3000, 'Message cannot exceed 3000 characters']
    },
    attachment: {
      filename: { type: String, default: null },
      fileSize: { type: Number, default: null },
      mimeType: { type: String, default: null },
      fileUrl: { type: String, default: null }
    },
    voiceMessage: {
      durationSeconds: { type: Number, default: null },
      transcription: { type: String, default: null },
      language: { type: String, default: 'English' }
    },
    status: {
      type: String,
      enum: ['New', 'In Review', 'Responded', 'Resolved', 'Closed'],
      default: 'New',
      index: true
    },
    ipAddress: { type: String, default: null },
    responseNote: { type: String, default: '' }
  },
  { timestamps: true }
);

contactMessageSchema.index({ email: 1, createdAt: -1 });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
