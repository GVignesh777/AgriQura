/**
 * Open-Meteo Weather Provider Implementation
 * Fetches high-resolution weather telemetry and geocoding from Open-Meteo APIs (No API key required).
 */

const WeatherProvider = require('./WeatherProvider');

/**
 * WMO Weather Interpretation Codes (WMO Code 4677)
 * Maps WMO code to human-readable condition string and icon type.
 */
const WMO_MAP = {
  0: { condition: 'Clear Sky', icon: 'clear-sky', isRain: false },
  1: { condition: 'Mainly Clear', icon: 'mainly-clear', isRain: false },
  2: { condition: 'Partly Cloudy', icon: 'partly-cloudy', isRain: false },
  3: { condition: 'Overcast', icon: 'overcast', isRain: false },
  45: { condition: 'Fog', icon: 'fog', isRain: false },
  48: { condition: 'Depositing Rime Fog', icon: 'fog', isRain: false },
  51: { condition: 'Light Drizzle', icon: 'drizzle', isRain: true },
  53: { condition: 'Moderate Drizzle', icon: 'drizzle', isRain: true },
  55: { condition: 'Dense Drizzle', icon: 'drizzle', isRain: true },
  56: { condition: 'Light Freezing Drizzle', icon: 'freezing-rain', isRain: true },
  57: { condition: 'Dense Freezing Drizzle', icon: 'freezing-rain', isRain: true },
  61: { condition: 'Slight Rain', icon: 'rain-light', isRain: true },
  63: { condition: 'Moderate Rain', icon: 'rain-moderate', isRain: true },
  65: { condition: 'Heavy Rain', icon: 'rain-heavy', isRain: true },
  66: { condition: 'Light Freezing Rain', icon: 'freezing-rain', isRain: true },
  67: { condition: 'Heavy Freezing Rain', icon: 'freezing-rain', isRain: true },
  71: { condition: 'Slight Snow Fall', icon: 'snow', isRain: false },
  73: { condition: 'Moderate Snow Fall', icon: 'snow', isRain: false },
  75: { condition: 'Heavy Snow Fall', icon: 'snow-heavy', isRain: false },
  77: { condition: 'Snow Grains', icon: 'snow', isRain: false },
  80: { condition: 'Slight Rain Showers', icon: 'showers-light', isRain: true },
  81: { condition: 'Moderate Rain Showers', icon: 'showers-moderate', isRain: true },
  82: { condition: 'Violent Rain Showers', icon: 'showers-heavy', isRain: true },
  85: { condition: 'Slight Snow Showers', icon: 'snow', isRain: false },
  86: { condition: 'Heavy Snow Showers', icon: 'snow-heavy', isRain: false },
  95: { condition: 'Thunderstorm', icon: 'thunderstorm', isRain: true },
  96: { condition: 'Thunderstorm with Slight Hail', icon: 'thunderstorm-hail', isRain: true },
  99: { condition: 'Thunderstorm with Heavy Hail', icon: 'thunderstorm-hail', isRain: true },
};

const getWmoMeta = (code) => {
  return WMO_MAP[code] || { condition: 'Partly Cloudy', icon: 'partly-cloudy', isRain: false };
};

class OpenMeteoProvider extends WeatherProvider {
  constructor() {
    super();
    this.forecastBaseUrl = 'https://api.open-meteo.com/v1/forecast';
    this.geocodingBaseUrl = 'https://geocoding-api.open-meteo.com/v1/search';
  }

  /**
   * Fetch full weather payload from Open-Meteo
   */
  async fetchRawForecast(lat, lon) {
    const params = new URLSearchParams({
      latitude: lat,
      longitude: lon,
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'precipitation',
        'weather_code',
        'cloud_cover',
        'surface_pressure',
        'wind_speed_10m',
        'wind_direction_10m',
      ].join(','),
      hourly: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'precipitation_probability',
        'precipitation',
        'weather_code',
        'surface_pressure',
        'wind_speed_10m',
        'wind_direction_10m',
      ].join(','),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'apparent_temperature_max',
        'apparent_temperature_min',
        'sunrise',
        'sunset',
        'precipitation_sum',
        'precipitation_hours',
        'precipitation_probability_max',
        'wind_speed_10m_max',
      ].join(','),
      timezone: 'auto',
      forecast_days: 16,
    });

    const url = `${this.forecastBaseUrl}?${params.toString()}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'AgriQura-WeatherService/1.0' } });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Open-Meteo API Error (${res.status}): ${errText}`);
    }

    return await res.json();
  }

  /**
   * Normalized Full Forecast Data
   */
  async getForecast(lat, lon) {
    const raw = await this.fetchRawForecast(lat, lon);
    const timezone = raw.timezone || 'Asia/Kolkata';

    // 1. Current Weather
    const currentRaw = raw.current || {};
    const currentWmo = getWmoMeta(currentRaw.weather_code);
    const dailyRaw = raw.daily || {};

    const current = {
      temperature: Math.round(currentRaw.temperature_2m ?? 30),
      feelsLike: Math.round(currentRaw.apparent_temperature ?? currentRaw.temperature_2m ?? 30),
      humidity: Math.round(currentRaw.relative_humidity_2m ?? 65),
      pressure: Math.round(currentRaw.surface_pressure ?? 1012),
      windSpeed: Math.round(currentRaw.wind_speed_10m ?? 12),
      windDirection: currentRaw.wind_direction_10m ?? 180,
      cloudCover: Math.round(currentRaw.cloud_cover ?? 30),
      visibility: 10, // Open-Meteo km estimate
      precipitation: Number((currentRaw.precipitation ?? 0).toFixed(1)),
      precipitationProbability: dailyRaw.precipitation_probability_max?.[0] ?? 0,
      condition: currentWmo.condition,
      icon: currentWmo.icon,
      isRain: currentWmo.isRain,
      weatherCode: currentRaw.weather_code ?? 0,
      sunrise: dailyRaw.sunrise?.[0]?.split('T')[1] || '06:00',
      sunset: dailyRaw.sunset?.[0]?.split('T')[1] || '18:30',
      time: currentRaw.time || new Date().toISOString(),
    };

    // 2. Hourly Forecast (Next 48 Hours)
    const hourlyRaw = raw.hourly || {};
    const hourlyTimes = hourlyRaw.time || [];
    const hourly = [];
    const maxHourlyItems = Math.min(hourlyTimes.length, 48);

    for (let i = 0; i < maxHourlyItems; i++) {
      const code = hourlyRaw.weather_code?.[i] ?? 0;
      const wmo = getWmoMeta(code);
      hourly.push({
        time: hourlyTimes[i],
        temperature: Math.round(hourlyRaw.temperature_2m?.[i] ?? 30),
        feelsLike: Math.round(hourlyRaw.apparent_temperature?.[i] ?? 30),
        humidity: Math.round(hourlyRaw.relative_humidity_2m?.[i] ?? 60),
        precipitationProbability: Math.round(hourlyRaw.precipitation_probability?.[i] ?? 0),
        precipitation: Number((hourlyRaw.precipitation?.[i] ?? 0).toFixed(1)),
        windSpeed: Math.round(hourlyRaw.wind_speed_10m?.[i] ?? 10),
        windDirection: hourlyRaw.wind_direction_10m?.[i] ?? 0,
        condition: wmo.condition,
        icon: wmo.icon,
        isRain: wmo.isRain,
        weatherCode: code,
      });
    }

    // 3. Multi-Day Forecast (Up to 16 Days)
    const dailyDates = dailyRaw.time || [];
    const daily = [];

    for (let i = 0; i < dailyDates.length; i++) {
      const code = dailyRaw.weather_code?.[i] ?? 0;
      const wmo = getWmoMeta(code);
      daily.push({
        date: dailyDates[i],
        minTemp: Math.round(dailyRaw.temperature_2m_min?.[i] ?? 22),
        maxTemp: Math.round(dailyRaw.temperature_2m_max?.[i] ?? 34),
        apparentMinTemp: Math.round(dailyRaw.apparent_temperature_min?.[i] ?? 22),
        apparentMaxTemp: Math.round(dailyRaw.apparent_temperature_max?.[i] ?? 35),
        precipitationProbability: Math.round(dailyRaw.precipitation_probability_max?.[i] ?? 0),
        precipitation: Number((dailyRaw.precipitation_sum?.[i] ?? 0).toFixed(1)),
        precipitationHours: dailyRaw.precipitation_hours?.[i] ?? 0,
        windSpeedMax: Math.round(dailyRaw.wind_speed_10m_max?.[i] ?? 14),
        sunrise: dailyRaw.sunrise?.[i]?.split('T')[1] || '06:00',
        sunset: dailyRaw.sunset?.[i]?.split('T')[1] || '18:30',
        condition: wmo.condition,
        icon: wmo.icon,
        isRain: wmo.isRain,
        weatherCode: code,
      });
    }

    return {
      location: {
        latitude: lat,
        longitude: lon,
        timezone,
      },
      current,
      hourly,
      daily,
      alerts: [], // Open-Meteo does not provide government CAP alerts; seam open for OpenWeather
      metadata: {
        provider: 'Open-Meteo',
        updatedAt: new Date().toISOString(),
        cacheStatus: 'fresh',
      },
    };
  }

  async getCurrent(lat, lon) {
    const forecast = await this.getForecast(lat, lon);
    return {
      location: forecast.location,
      current: forecast.current,
      metadata: forecast.metadata,
    };
  }

  async getHourly(lat, lon) {
    const forecast = await this.getForecast(lat, lon);
    return forecast.hourly;
  }

  async getDaily(lat, lon) {
    const forecast = await this.getForecast(lat, lon);
    return forecast.daily;
  }

  async getAlerts(lat, lon) {
    return [];
  }

  /**
   * Geocode location names using Open-Meteo Geocoding API
   */
  async geocode(query) {
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return [];
    }

    const cleanQuery = encodeURIComponent(query.trim());
    const url = `${this.geocodingBaseUrl}?name=${cleanQuery}&count=10&language=en&format=json`;

    const res = await fetch(url, { headers: { 'User-Agent': 'AgriQura-GeocodingService/1.0' } });
    if (!res.ok) {
      throw new Error(`Geocoding search failed (${res.status})`);
    }

    const data = await res.json();
    const results = data.results || [];

    return results.map((item) => ({
      id: item.id,
      name: item.name,
      district: item.admin2 || item.admin3 || '',
      state: item.admin1 || '',
      country: item.country || 'India',
      countryCode: item.country_code || 'IN',
      latitude: item.latitude,
      longitude: item.longitude,
      elevation: item.elevation,
      timezone: item.timezone,
      displayText: [item.name, item.admin2, item.admin1, item.country].filter(Boolean).join(', '),
    }));
  }
}

module.exports = OpenMeteoProvider;
