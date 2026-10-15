const mongoose = require('mongoose');

const weatherDataSchema = new mongoose.Schema(
  {
    locationKey: {
      type: String,
      required: true,
      index: true,
    },
    district: { type: String, required: true },
    state: { type: String, required: true },
    temperatureC: { type: Number, required: true },
    humidityPercent: { type: Number, required: true },
    windSpeedKmh: { type: Number, default: 0 },
    rainfallMm: { type: Number, default: 0 },
    condition: { type: String, required: true },
    forecast: [
      {
        day: { type: String },
        tempMinC: { type: Number },
        tempMaxC: { type: Number },
        rainProbability: { type: Number },
        condition: { type: String },
      },
    ],
    agriculturalAdvice: {
      fertilizerAdvice: { type: String, default: '' },
      irrigationAdvice: { type: String, default: '' },
      pestWarning: { type: String, default: '' },
    },
    fetchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WeatherData', weatherDataSchema);
