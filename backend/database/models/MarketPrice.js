const mongoose = require('mongoose');

const marketPriceSchema = new mongoose.Schema(
  {
    state: { type: String, required: true },
    district: { type: String, required: true },
    mandiName: { type: String, required: true },
    cropName: { type: String, required: true },
    variety: { type: String, default: 'Standard' },
    minPriceQuintal: { type: Number, required: true },
    maxPriceQuintal: { type: Number, required: true },
    modalPriceQuintal: { type: Number, required: true },
    priceTrend: {
      type: String,
      enum: ['Up', 'Down', 'Stable'],
      default: 'Stable',
    },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MarketPrice', marketPriceSchema);
