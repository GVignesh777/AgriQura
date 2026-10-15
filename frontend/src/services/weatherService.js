/**
 * AgriQura Frontend Weather Service
 * Communicates with backend /api/weather/* endpoints with request deduplication and local session caching.
 */

import api from './api';

// In-flight promise map for deduplication
const inFlightRequests = new Map();

class WeatherService {
  /**
   * Fetch full forecast with agricultural intelligence
   */
  async getForecast({ lat, lon, locationName = '', state = '', refresh = false } = {}) {
    const roundedLat = Number(lat || 17.9689).toFixed(3);
    const roundedLon = Number(lon || 79.5941).toFixed(3);
    const requestKey = `forecast:${roundedLat}:${roundedLon}:${refresh}`;

    // Return ongoing promise if already in flight
    if (inFlightRequests.has(requestKey)) {
      return inFlightRequests.get(requestKey);
    }

    const promise = (async () => {
      try {
        const params = new URLSearchParams({
          lat: roundedLat,
          lon: roundedLon,
        });

        if (locationName) params.append('locationName', locationName);
        if (state) params.append('state', state);
        if (refresh) params.append('refresh', 'true');

        const response = await api.get(`/weather/forecast?${params.toString()}`);
        return response.data?.weather;
      } finally {
        inFlightRequests.delete(requestKey);
      }
    })();

    inFlightRequests.set(requestKey, promise);
    return promise;
  }

  /**
   * Fetch lightweight current weather for widgets
   */
  async getCurrent({ lat, lon, refresh = false } = {}) {
    const roundedLat = Number(lat || 17.9689).toFixed(3);
    const roundedLon = Number(lon || 79.5941).toFixed(3);
    const requestKey = `current:${roundedLat}:${roundedLon}:${refresh}`;

    if (inFlightRequests.has(requestKey)) {
      return inFlightRequests.get(requestKey);
    }

    const promise = (async () => {
      try {
        const params = new URLSearchParams({
          lat: roundedLat,
          lon: roundedLon,
        });
        if (refresh) params.append('refresh', 'true');

        const response = await api.get(`/weather/current?${params.toString()}`);
        return response.data?.current;
      } finally {
        inFlightRequests.delete(requestKey);
      }
    })();

    inFlightRequests.set(requestKey, promise);
    return promise;
  }

  /**
   * Search locations / villages / towns via Open-Meteo Geocoding
   */
  async searchLocations(query) {
    if (!query || query.trim().length < 2) return [];

    try {
      const response = await api.get(`/weather/geocode?query=${encodeURIComponent(query.trim())}`);
      return response.data?.results || [];
    } catch (err) {
      console.warn('⚠️ [Geocoding Search Error]:', err);
      return [];
    }
  }

  /**
   * Request Groq AI interpretation for weather & specific crop
   */
  async getAIAdvisory({ weatherData, crop = 'Cotton', question = '', language = 'en' } = {}) {
    try {
      const response = await api.post('/weather/ai-advisory', {
        weatherData,
        crop,
        question,
        language,
      });
      return response.data?.advisory;
    } catch (err) {
      console.error('❌ [AI Weather Advisory Error]:', err);
      throw err;
    }
  }
}

export const weatherService = new WeatherService();
