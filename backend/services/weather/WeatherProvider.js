/**
 * AgriQura Weather Provider Interface (Abstract Base Class)
 * Defines the contract for weather data providers (Open-Meteo, OpenWeather, etc.)
 */

class WeatherProvider {
  /**
   * Get normalized current weather
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @returns {Promise<Object>}
   */
  async getCurrent(lat, lon) {
    throw new Error('Method getCurrent() must be implemented by concrete provider');
  }

  /**
   * Get normalized full forecast (current, hourly, 16-day daily)
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @returns {Promise<Object>}
   */
  async getForecast(lat, lon) {
    throw new Error('Method getForecast() must be implemented by concrete provider');
  }

  /**
   * Get normalized hourly forecast
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @returns {Promise<Array>}
   */
  async getHourly(lat, lon) {
    throw new Error('Method getHourly() must be implemented by concrete provider');
  }

  /**
   * Get normalized daily forecast
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @returns {Promise<Array>}
   */
  async getDaily(lat, lon) {
    throw new Error('Method getDaily() must be implemented by concrete provider');
  }

  /**
   * Get weather alerts
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @returns {Promise<Array>}
   */
  async getAlerts(lat, lon) {
    throw new Error('Method getAlerts() must be implemented by concrete provider');
  }

  /**
   * Geocode location search query
   * @param {string} query - Location name (e.g. "Warangal", "Nizamabad")
   * @returns {Promise<Array>}
   */
  async geocode(query) {
    throw new Error('Method geocode() must be implemented by concrete provider');
  }
}

module.exports = WeatherProvider;
