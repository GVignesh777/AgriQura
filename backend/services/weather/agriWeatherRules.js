/**
 * AgriQura Agricultural Weather Intelligence & Decision Rules Engine
 * Translates raw weather telemetry into agronomic risk indicators and farming activity recommendations.
 * 
 * Rules & Thresholds:
 * - Wind Risk: <15 km/h Low (Calm, safe for spraying), 15-25 km/h Moderate (Drift risk), >25 km/h High (Severe drift & lodging).
 * - Rain Risk: <20% Low, 20-60% Moderate (Possible wash-off), >60% High (Heavy leaching & surface runoff).
 * - Heat Stress: 20-34°C Low (Optimal), 35-40°C Moderate (Pollen sterility risk), >40°C High (Thermal stress & flower drop).
 * - Humidity: <60% Low, 60-80% Moderate, >80% with 24-32°C High (Severe fungal sporulation: blast, blight, boll rot).
 * - Storm Risk: Thunderstorm/Hail WMO 95, 96, 99 or winds >35 km/h High.
 */

/**
 * Calculate Agricultural Risk Indicators
 */
const computeRiskIndicators = (current, todayDaily, hourly) => {
  const temp = current.temperature;
  const feelsLike = current.feelsLike;
  const wind = current.windSpeed;
  const humidity = current.humidity;
  const rainProb = todayDaily?.precipitationProbability ?? current.precipitationProbability ?? 0;
  const rainMm = todayDaily?.precipitation ?? current.precipitation ?? 0;
  const weatherCode = current.weatherCode ?? 0;

  // 1. Wind Risk
  let windLevel = 'Low';
  let windReason = `Current wind is calm (${wind} km/h), suitable for foliar spraying and field work.`;
  if (wind > 25) {
    windLevel = 'High';
    windReason = `High winds (${wind} km/h) can cause severe spray drift, lodging in standing crops, and physical leaf tearing.`;
  } else if (wind >= 15) {
    windLevel = 'Moderate';
    windReason = `Breezy conditions (${wind} km/h); fine droplet spray applications may drift away from target foliage.`;
  }

  // 2. Rain / Precipitation Risk
  let rainLevel = 'Low';
  let rainReason = `Low rain probability (${rainProb}%); ideal for harvesting, pesticide spraying, and open field drying.`;
  if (rainProb > 60 || rainMm >= 10) {
    rainLevel = 'High';
    rainReason = `High rain likelihood (${rainProb}%, ~${rainMm} mm); chemical wash-off and fertilizer runoff leaching expected.`;
  } else if (rainProb >= 25 || rainMm >= 2) {
    rainLevel = 'Moderate';
    rainReason = `Moderate chance of scattered precipitation (${rainProb}%); monitor clouds before scheduling systemic spray.`;
  }

  // 3. Heat / Thermal Stress Risk
  let heatLevel = 'Low';
  let heatReason = `Temperature (${temp}°C) is within the optimal metabolic range for active vegetative and boll development.`;
  if (temp > 40 || feelsLike > 44) {
    heatLevel = 'High';
    heatReason = `Severe heat stress (${temp}°C, feels like ${feelsLike}°C); may trigger flower drop and fruit scorching.`;
  } else if (temp >= 35) {
    heatLevel = 'Moderate';
    heatReason = `Warm conditions (${temp}°C); maintain root-zone soil moisture to prevent midday plant wilting.`;
  }

  // 4. Humidity & Fungal Disease Risk
  let humidityLevel = 'Low';
  let humidityReason = `Moderate air moisture (${humidity}%); low fungal and bacterial spore proliferation pressure.`;
  if (humidity >= 80 && temp >= 22 && temp <= 33) {
    humidityLevel = 'High';
    humidityReason = `High relative humidity (${humidity}%) with warm temperatures favors rapid fungal sporulation (mildew, blight, rot).`;
  } else if (humidity >= 70) {
    humidityLevel = 'Moderate';
    humidityReason = `Elevated humidity (${humidity}%); scout crop undersides for sucking pests (whitefly, aphids, mites).`;
  }

  // 5. Storm / Convective Hazard
  let stormLevel = 'Low';
  let stormReason = 'No convective squalls or electrical storm hazards detected.';
  if (weatherCode === 95 || weatherCode === 96 || weatherCode === 99 || wind > 35) {
    stormLevel = 'High';
    stormReason = `Thunderstorm/Hail warning (WMO code ${weatherCode}, gusts ~${wind} km/h). Secure farm structures and pause field machinery.`;
  } else if (weatherCode >= 80 && weatherCode <= 82 && wind >= 20) {
    stormLevel = 'Moderate';
    stormReason = 'Gusty rain showers anticipated; ensure field drainage channels are unobstructed.';
  }

  return [
    { type: 'rain', label: 'Rain Risk', level: rainLevel, score: rainProb, reason: rainReason },
    { type: 'wind', label: 'Wind Drift Risk', level: windLevel, score: wind, reason: windReason },
    { type: 'heat', label: 'Heat Stress Risk', level: heatLevel, score: temp, reason: heatReason },
    { type: 'humidity', label: 'Fungal / Pest Risk', level: humidityLevel, score: humidity, reason: humidityReason },
    { type: 'storm', label: 'Storm Hazard', level: stormLevel, score: weatherCode, reason: stormReason },
  ];
};

/**
 * Generate Farming Activity Decision Recommendations
 */
const computeFarmingActivities = (current, todayDaily, tomorrowDaily, hourly) => {
  const temp = current.temperature;
  const wind = current.windSpeed;
  const humidity = current.humidity;
  const rainProbToday = todayDaily?.precipitationProbability ?? 0;
  const rainMmToday = todayDaily?.precipitation ?? 0;
  const rainProbTomorrow = tomorrowDaily?.precipitationProbability ?? 0;

  const activities = [];

  // 1. Spraying (Fungicide / Insecticide / Foliar Nutrition)
  if (wind < 15 && rainProbToday < 25 && temp < 35) {
    activities.push({
      key: 'spraying',
      title: 'Pesticide & Foliar Spraying',
      status: 'Suitable',
      icon: 'spray',
      rating: 'Favorable',
      reason: `Calm wind (${wind} km/h) and dry weather (rain probability ${rainProbToday}%) provide an ideal 6-hour absorption window.`,
    });
  } else if (wind >= 15) {
    activities.push({
      key: 'spraying',
      title: 'Pesticide & Foliar Spraying',
      status: 'Not Recommended',
      icon: 'spray',
      rating: 'Unfavorable',
      reason: `Wind speed is ${wind} km/h (exceeds 15 km/h threshold). Spraying now will cause chemical drift and uneven crop coverage.`,
    });
  } else if (rainProbToday >= 40) {
    activities.push({
      key: 'spraying',
      title: 'Pesticide & Foliar Spraying',
      status: 'Postpone',
      icon: 'spray',
      rating: 'Unfavorable',
      reason: `Rain probability is elevated at ${rainProbToday}%. Moisture on foliage will wash away chemicals before systemic absorption.`,
    });
  } else {
    activities.push({
      key: 'spraying',
      title: 'Pesticide & Foliar Spraying',
      status: 'Caution',
      icon: 'spray',
      rating: 'Moderate',
      reason: `Moderate conditions (${temp}°C, ${wind} km/h). Spray during early morning (6–9 AM) or late evening (4–6 PM).`,
    });
  }

  // 2. Irrigation Scheduling
  if (rainProbToday > 60 || rainMmToday >= 8 || rainProbTomorrow > 70) {
    activities.push({
      key: 'irrigation',
      title: 'Irrigation & Watering',
      status: 'Pause / Skip',
      icon: 'droplet',
      rating: 'Favorable',
      reason: `Upcoming rainfall (${rainMmToday} mm today, ${rainProbTomorrow}% rain tomorrow) provides sufficient natural moisture; prevent waterlogging.`,
    });
  } else if (temp > 35 || humidity < 50) {
    activities.push({
      key: 'irrigation',
      title: 'Irrigation & Watering',
      status: 'Recommended',
      icon: 'droplet',
      rating: 'Favorable',
      reason: `High evapotranspiration rate (${temp}°C, ${humidity}% humidity). Apply light drip irrigation during early morning hours.`,
    });
  } else {
    activities.push({
      key: 'irrigation',
      title: 'Irrigation & Watering',
      status: 'Normal Schedule',
      icon: 'droplet',
      rating: 'Moderate',
      reason: `Standard moisture loss rates. Maintain regular drip/furrow intervals based on local soil moisture.`,
    });
  }

  // 3. Fertilizer Top-Dressing
  if (rainProbToday > 65 || rainMmToday > 15) {
    activities.push({
      key: 'fertilizer',
      title: 'Fertilizer Application',
      status: 'Postpone',
      icon: 'sprout',
      rating: 'Unfavorable',
      reason: `Heavy rainfall expected (${rainMmToday} mm). Top-dressing granular urea or NPK now will result in nitrate leaching into drainage channels.`,
    });
  } else if (rainProbToday >= 20 && rainProbToday <= 50) {
    activities.push({
      key: 'fertilizer',
      title: 'Fertilizer Application',
      status: 'Highly Favorable',
      icon: 'sprout',
      rating: 'Favorable',
      reason: `Light scattered showers anticipated (${rainProbToday}%); ideal for dissolving and incorporating nitrogen/phosphorus granules into the root zone.`,
    });
  } else {
    activities.push({
      key: 'fertilizer',
      title: 'Fertilizer Application',
      status: 'Apply with Irrigation',
      icon: 'sprout',
      rating: 'Moderate',
      reason: `Dry soil conditions. If top-dressing dry fertilizer, follow immediately with controlled drip or furrow irrigation.`,
    });
  }

  // 4. Sowing & Transplantation
  if (temp >= 20 && temp <= 34 && rainProbToday < 50 && wind < 20) {
    activities.push({
      key: 'sowing',
      title: 'Sowing & Transplantation',
      status: 'Optimal Window',
      icon: 'seed',
      rating: 'Favorable',
      reason: `Favorable soil germination temperature (${temp}°C) and moderate moisture without torrential wash-out risks.`,
    });
  } else if (temp > 38) {
    activities.push({
      key: 'sowing',
      title: 'Sowing & Transplantation',
      status: 'Delay Sowing',
      icon: 'seed',
      rating: 'Unfavorable',
      reason: `High soil surface temperature (${temp}°C) increases young seedling mortality and poor seed germination.`,
    });
  } else {
    activities.push({
      key: 'sowing',
      title: 'Sowing & Transplantation',
      status: 'Moderate',
      icon: 'seed',
      rating: 'Moderate',
      reason: `Monitor seedbed moisture closely and ensure adequate shading if transplanting nursery saplings.`,
    });
  }

  // 5. Field Work & Land Tillage
  if (rainProbToday < 20 && (todayDaily?.precipitation ?? 0) < 1) {
    activities.push({
      key: 'fieldwork',
      title: 'Tractor Tillage & Weeding',
      status: 'Recommended',
      icon: 'tractor',
      rating: 'Favorable',
      reason: `Dry soil conditions allow tractor operations, inter-cultivation, and weeding without causing soil compaction or machinery slippage.`,
    });
  } else {
    activities.push({
      key: 'fieldwork',
      title: 'Tractor Tillage & Weeding',
      status: 'Exercise Caution',
      icon: 'tractor',
      rating: 'Moderate',
      reason: `Damp ground may cause tire slippage, subsoil compaction, and poor weed uprooting efficacy.`,
    });
  }

  // 6. Harvesting & Crop Protection
  if (rainProbToday > 50 || rainMmToday > 5) {
    activities.push({
      key: 'harvest',
      title: 'Harvest & Crop Protection',
      status: 'Protect Harvested Crop',
      icon: 'shield',
      rating: 'Unfavorable',
      reason: `Rain forecast (${rainProbToday}%, ~${rainMmToday} mm). Move harvested grain, cotton, or spices to covered storage or secure with tarpaulins.`,
    });
  } else {
    activities.push({
      key: 'harvest',
      title: 'Harvest & Crop Protection',
      status: 'Safe for Harvest',
      icon: 'shield',
      rating: 'Favorable',
      reason: `Clear and dry atmosphere is well suited for mechanical harvesting and outdoor grain/produce sun-drying.`,
    });
  }

  return activities;
};

/**
 * Generate 1-Paragraph Plain-Language Farmer Summary
 */
const generateFarmerSummary = (current, todayDaily, risks, activities) => {
  const temp = current.temperature;
  const cond = current.condition;
  const rainProb = todayDaily?.precipitationProbability ?? 0;
  const rainMm = todayDaily?.precipitation ?? 0;
  const wind = current.windSpeed;

  let text = `Today's weather is ${cond} with a temperature of ${temp}°C and wind speed of ${wind} km/h. `;

  if (rainProb > 50) {
    text += `Rain is likely today (${rainProb}% chance, around ${rainMm} mm expected). We advise pausing open irrigation and postponing chemical spraying to prevent wash-off. `;
  } else if (wind >= 15) {
    text += `Wind speeds are elevated (${wind} km/h), so spraying should be postponed until calmer morning or evening hours. `;
  } else {
    text += `Weather conditions are calm and favorable for general field operations, weeding, and scheduled foliar applications. `;
  }

  return text;
};

module.exports = {
  computeRiskIndicators,
  computeFarmingActivities,
  generateFarmerSummary,
};
