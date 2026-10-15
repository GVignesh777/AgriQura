/**
 * AgriQura Weather Controller
 * Unified API endpoints for current weather, hourly forecast, 16-day daily forecast,
 * agricultural intelligence advisory, location geocoding, and Groq AI interpretation.
 */

const OpenMeteoProvider = require('../services/weather/OpenMeteoProvider');
const OpenWeatherProvider = require('../services/weather/OpenWeatherProvider');
const weatherCache = require('../services/weather/weatherCache');
const {
  computeRiskIndicators,
  computeFarmingActivities,
  generateFarmerSummary,
} = require('../services/weather/agriWeatherRules');
const { getGroqClient } = require('../services/groqClient');
const env = require('../config/env');

const openMeteo = new OpenMeteoProvider();
const openWeather = new OpenWeatherProvider();

// Active provider selection (Open-Meteo primary)
const getActiveProvider = () => {
  return openMeteo;
};

// Default coordinates (Warangal, Telangana) if none provided
const DEFAULT_LAT = 17.9689;
const DEFAULT_LON = 79.5941;

/**
 * Validate and sanitize latitude & longitude parameters
 */
const parseCoordinates = (query) => {
  let lat = parseFloat(query.lat || query.latitude);
  let lon = parseFloat(query.lon || query.longitude || query.lng);

  if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return { lat: DEFAULT_LAT, lon: DEFAULT_LON, isDefault: true };
  }

  return { lat, lon, isDefault: false };
};

/**
 * GET /api/weather/forecast
 * Main comprehensive weather forecast endpoint with agricultural intelligence
 */
exports.getForecast = async (req, res, next) => {
  try {
    const { lat, lon } = parseCoordinates(req.query);
    const locationName = req.query.locationName || req.query.district || 'Current Location';
    const stateName = req.query.state || '';

    const cacheKey = weatherCache.generateKey('weather:forecast', lat, lon);
    const cached = weatherCache.get(cacheKey);

    if (cached && !cached.isStale && req.query.refresh !== 'true') {
      return res.status(200).json({
        success: true,
        weather: {
          ...cached.data,
          metadata: {
            ...cached.data.metadata,
            cacheStatus: 'cached',
          },
        },
      });
    }

    try {
      const provider = getActiveProvider();
      const rawData = await provider.getForecast(lat, lon);

      // Compute Agricultural Intelligence Layer from real telemetry
      const risks = computeRiskIndicators(rawData.current, rawData.daily[0], rawData.hourly);
      const activities = computeFarmingActivities(
        rawData.current,
        rawData.daily[0],
        rawData.daily[1],
        rawData.hourly
      );
      const farmerSummary = generateFarmerSummary(
        rawData.current,
        rawData.daily[0],
        risks,
        activities
      );

      const normalizedPayload = {
        ...rawData,
        location: {
          ...rawData.location,
          name: locationName,
          state: stateName,
        },
        risks,
        activities,
        farmerSummary,
      };

      // Store in Cache
      weatherCache.set(cacheKey, normalizedPayload, weatherCache.TTL_FORECAST);

      return res.status(200).json({
        success: true,
        weather: normalizedPayload,
      });
    } catch (providerErr) {
      console.warn('⚠️ [Weather Provider Error]:', providerErr.message);

      // Fallback to stale cache if available
      if (cached && cached.data) {
        return res.status(200).json({
          success: true,
          weather: {
            ...cached.data,
            metadata: {
              ...cached.data.metadata,
              cacheStatus: 'stale',
            },
          },
          warning: 'Showing recently updated weather data (live provider temporarily busy).',
        });
      }

      throw providerErr;
    }
  } catch (error) {
    console.error('❌ [Weather Controller Error]:', error);
    next(error);
  }
};

/**
 * GET /api/weather/current
 * Lightweight current weather endpoint
 */
exports.getCurrent = async (req, res, next) => {
  try {
    const { lat, lon } = parseCoordinates(req.query);
    const cacheKey = weatherCache.generateKey('weather:current', lat, lon);
    const cached = weatherCache.get(cacheKey);

    if (cached && !cached.isStale && req.query.refresh !== 'true') {
      return res.status(200).json({
        success: true,
        current: cached.data,
        cacheStatus: 'cached',
      });
    }

    const provider = getActiveProvider();
    const currentData = await provider.getCurrent(lat, lon);

    weatherCache.set(cacheKey, currentData, weatherCache.TTL_CURRENT);

    return res.status(200).json({
      success: true,
      current: currentData,
      cacheStatus: 'fresh',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/weather/hourly
 * 48-Hour Hourly Forecast
 */
exports.getHourly = async (req, res, next) => {
  try {
    const { lat, lon } = parseCoordinates(req.query);
    const provider = getActiveProvider();
    const hourly = await provider.getHourly(lat, lon);
    return res.status(200).json({ success: true, hourly });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/weather/daily
 * 16-Day Daily Forecast
 */
exports.getDaily = async (req, res, next) => {
  try {
    const { lat, lon } = parseCoordinates(req.query);
    const provider = getActiveProvider();
    const daily = await provider.getDaily(lat, lon);
    return res.status(200).json({ success: true, daily });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/weather/alerts
 * Weather Alerts (OpenWeather fallback seam)
 */
exports.getAlerts = async (req, res, next) => {
  try {
    const { lat, lon } = parseCoordinates(req.query);
    const alerts = await openWeather.getAlerts(lat, lon);
    return res.status(200).json({ success: true, alerts });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/weather/geocode
 * Search village, town, district, city via Open-Meteo Geocoding API
 */
exports.geocode = async (req, res, next) => {
  try {
    const query = req.query.query || req.query.q || '';
    if (!query.trim()) {
      return res.status(200).json({ success: true, results: [] });
    }

    const cacheKey = weatherCache.generateGeocodeKey(query);
    const cached = weatherCache.get(cacheKey);

    if (cached && !cached.isStale) {
      return res.status(200).json({ success: true, results: cached.data });
    }

    const provider = getActiveProvider();
    const results = await provider.geocode(query);

    weatherCache.set(cacheKey, results, weatherCache.TTL_GEOCODE);

    return res.status(200).json({ success: true, results });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/weather/ai-advisory
 * Groq Llama-3 AI Interpretation of real weather data for specific farmer crops & queries
 */
exports.getAIAdvisory = async (req, res, next) => {
  try {
    const { weatherData, crop = 'Cotton', question, language = 'en' } = req.body;

    if (!weatherData || !weatherData.current) {
      return res.status(400).json({ success: false, error: 'Weather data is required' });
    }

    const current = weatherData.current;
    const risks = weatherData.risks || [];
    const activities = weatherData.activities || [];

    if (!env.groqApiKey) {
      return res.status(200).json({
        success: true,
        advisory: `Based on current weather (${current.temperature}°C, ${current.humidity}% humidity, wind ${current.windSpeed} km/h), field operations should be scheduled carefully. Spraying is ${activities.find((a) => a.key === 'spraying')?.status || 'moderate'}.`,
      });
    }

    const groq = getGroqClient();
    const prompt = `You are AgriQura's Senior Agricultural Meteorologist.
Analyze the following REAL WEATHER DATA for a farmer growing ${crop}.

WEATHER TELEMETRY:
- Temperature: ${current.temperature}°C (Feels like: ${current.feelsLike}°C)
- Condition: ${current.condition}
- Humidity: ${current.humidity}%
- Wind Speed: ${current.windSpeed} km/h
- Rain Probability: ${current.precipitationProbability}% (Precipitation: ${current.precipitation} mm)

FARMING RISKS DETECTED:
${risks.map((r) => `- ${r.label}: ${r.level} (${r.reason})`).join('\n')}

FARMER QUESTION: "${question || `What are the best farm management practices for my ${crop} crop today with this weather?`}"

LANGUAGE: Respond in ${language} (if telugu or hindi requested, write natural fluent script).

RULES:
1. Ground every statement strictly in the real numbers above. Do not invent weather.
2. Provide direct, actionable recommendations for: Spraying, Irrigation, and Crop Protection.
3. Keep the tone empathetic, practical, and farmer-friendly (max 3 concise paragraphs).`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are an agricultural weather intelligence expert. Provide practical, data-backed farming guidance.' },
        { role: 'user', content: prompt },
      ],
      model: env.groqFastModel || 'llama-3.1-8b-instant',
      temperature: 0.2,
      max_tokens: 600,
    });

    const advisory = completion.choices[0]?.message?.content || '';

    return res.status(200).json({
      success: true,
      advisory,
    });
  } catch (error) {
    console.error('❌ [Weather AI Advisory Error]:', error);
    next(error);
  }
};
