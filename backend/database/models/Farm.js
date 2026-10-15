const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
      required: true,
    },
    farmName: {
      type: String,
      required: [true, 'Farm name is required'],
      trim: true,
    },
    location: {
      state: { type: String, required: true },
      district: { type: String, required: true },
      village: { type: String, default: '' },
      latitude: { type: Number, default: 0 },
      longitude: { type: Number, default: 0 },
    },
    areaAcres: {
      type: Number,
      required: [true, 'Farm area in acres is required'],
      min: 0.1,
    },
    crop: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
    },
    variety: {
      type: String,
      default: 'Standard',
      trim: true,
    },
    sowingDate: {
      type: Date,
      required: [true, 'Sowing date is required'],
    },
    expectedHarvestDate: {
      type: Date,
    },
    cropStage: {
      type: String,
      enum: ['Land Prep', 'Seedling / Germination', 'Vegetative', 'Flowering', 'Fruiting / Grain Formation', 'Maturation', 'Harvested'],
      default: 'Vegetative',
    },
    soilType: {
      type: String,
      enum: ['Black Soil', 'Red Soil', 'Alluvial Soil', 'Laterite Soil', 'Sandy Soil', 'Clayey Soil', 'Loamy Soil', 'Unknown'],
      default: 'Loamy Soil',
    },
    irrigationType: {
      type: String,
      enum: ['Borewell', 'Canal', 'Rainfed', 'Drip', 'Sprinkler', 'Other'],
      default: 'Drip',
    },
    healthScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 85,
    },
    status: {
      type: String,
      enum: ['Active', 'Harvested', 'Fallow'],
      default: 'Active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Farm', farmSchema);
