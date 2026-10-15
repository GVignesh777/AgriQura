/**
 * OpenWeather One Call API 3.0 Provider (Seam for Future Integration)
 * Can be activated if an OPENWEATHER_API_KEY is supplied.
 */

const WeatherProvider = require('./WeatherProvider');
const env = require('../../config/env');

class OpenWeatherProvider extends WeatherProvider {
  constructor() {
    super();
    this.apiKey = env.openWeatherApiKey || process.env.OPENWEATHER_API_KEY || null;
    this.baseUrl = 'https://api.openweathermap.org/data/3.0/onecall';
    this.geocodingUrl = 'https://api.openweathermap.org/geo/1.0/direct';
  }

  isAvailable() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async getForecast(lat, lon) {
    if (!this.isAvailable()) {
      throw new Error('OpenWeather One Call 3.0 is not configured (missing OPENWEATHER_API_KEY).');
    }

    const url = `${this.baseUrl}?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`;
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenWeather error (${res.status}): ${err}`);
    }

    const data = await res.json();
    return data;
  }

  async getAlerts(lat, lon) {
    if (!this.isAvailable()) return [];
    try {
      const forecast = await this.getForecast(lat, lon);
      return forecast.alerts || [];
    } catch {
      return [];
    }
  }

  async geocode(query) {
    if (!this.isAvailable()) return [];
    const url = `${this.geocodingUrl}?q=${encodeURIComponent(query)}&limit=5&appid=${this.apiKey}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((item) => ({
      name: item.name,
      state: item.state,
      country: item.country,
      latitude: item.lat,
      longitude: item.lon,
      displayText: [item.name, item.state, item.country].filter(Boolean).join(', '),
    }));
  }
}

module.exports = OpenWeatherProvider;
