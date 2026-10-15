const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
    },
    subDistrict: {
      type: String,
      trim: true,
      default: '',
    },
    village: {
      type: String,
      trim: true,
      default: '',
    },
    landSizeAcres: {
      type: Number,
      default: 0,
    },
    soilType: {
      type: String,
      enum: ['Black Soil', 'Red Soil', 'Alluvial Soil', 'Laterite Soil', 'Sandy Soil', 'Clayey Soil', 'Loamy Soil', 'Unknown'],
      default: 'Unknown',
    },
    irrigationSource: {
      type: String,
      enum: ['Borewell', 'Canal', 'Rainfed', 'Drip', 'Sprinkler', 'Mixed', 'Other'],
      default: 'Rainfed',
    },
    primaryCrops: [{
      type: String,
      trim: true,
    }],
    experienceYears: {
      type: Number,
      default: 1,
    },
    consentAgreed: {
      type: Boolean,
      default: false,
    },
    consentAgreedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Farmer', farmerSchema);
