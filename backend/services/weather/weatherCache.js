/**
 * AgriQura Weather In-Memory TTL Cache Layer
 * Provides high-speed deduplication, TTL expiration, and graceful stale fallback.
 */

class WeatherCache {
  constructor() {
    this.cache = new Map();
    // Default TTLs in milliseconds
    this.TTL_CURRENT = 15 * 60 * 1000; // 15 minutes
    this.TTL_FORECAST = 60 * 60 * 1000; // 60 minutes
    this.TTL_GEOCODE = 24 * 60 * 60 * 1000; // 24 hours

    // Sweep expired items periodically
    setInterval(() => this.cleanup(), 15 * 60 * 1000);
  }

  generateKey(prefix, lat, lon) {
    const rLat = Number(lat).toFixed(3);
    const rLon = Number(lon).toFixed(3);
    return `${prefix}:${rLat}:${rLon}`;
  }

  generateGeocodeKey(query) {
    return `geocode:${(query || '').trim().toLowerCase()}`;
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    const isExpired = now - entry.cachedAt > entry.ttl;

    if (!isExpired) {
      return {
        data: entry.data,
        isStale: false,
        cachedAt: entry.cachedAt,
      };
    }

    // Retain entry for stale-fallback if network goes down
    return {
      data: entry.data,
      isStale: true,
      cachedAt: entry.cachedAt,
    };
  }

  set(key, data, ttl = this.TTL_FORECAST) {
    this.cache.set(key, {
      data,
      cachedAt: Date.now(),
      ttl,
    });
  }

  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      // Evict items older than 48 hours
      if (now - entry.cachedAt > 48 * 60 * 60 * 1000) {
        this.cache.delete(key);
      }
    }
  }
}

module.exports = new WeatherCache();
