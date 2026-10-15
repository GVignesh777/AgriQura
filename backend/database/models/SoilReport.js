const mongoose = require('mongoose');

const soilReportSchema = new mongoose.Schema(
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
    phLevel: { type: Number, required: true },
    nitrogenRatio: { type: Number, required: true },
    phosphorusRatio: { type: Number, required: true },
    potassiumRatio: { type: Number, required: true },
    organicCarbonPercent: { type: Number, default: 0.5 },
    soilType: { type: String, required: true },
    aiAnalysis: {
      deficiencies: [{ type: String }],
      suitableCrops: [{ type: String }],
      fertilizerDosage: [{ type: String }],
      improvementPlan: { type: String, default: '' },
    },
    reportImageUrl: { type: String, default: '' },
    testDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SoilReport', soilReportSchema);
