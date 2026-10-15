/**
 * AgriQura Location Resolution Service
 * Manages 3-Tier Location Priority:
 * 1. Saved Farm Location from Profile (Default)
 * 2. Browser Geolocation (GPS "Use My Location")
 * 3. Manual Geocoding Search (Village/City/District)
 */

const STORAGE_KEY = 'agriqura_weather_active_location';

export const DEFAULT_FARM_LOCATION = {
  name: 'Warangal South Farm',
  district: 'Warangal',
  state: 'Telangana',
  country: 'India',
  latitude: 17.9689,
  longitude: 79.5941,
  type: 'saved_farm',
};

class LocationService {
  /**
   * Get the active working location for weather
   */
  getActiveLocation(userFarms = []) {
    // 1. Check Session/Local override
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore
    }

    // 2. Check user's saved farm profile
    if (userFarms && userFarms.length > 0) {
      const primaryFarm = userFarms[0];
      const farmLoc = primaryFarm.location || {};
      if (farmLoc.latitude && farmLoc.longitude) {
        return {
          name: primaryFarm.farmName || farmLoc.district || 'My Farm',
          district: farmLoc.district || 'Warangal',
          state: farmLoc.state || 'Telangana',
          country: 'India',
          latitude: farmLoc.latitude,
          longitude: farmLoc.longitude,
          type: 'saved_farm',
        };
      }
    }

    // 3. Fallback default
    return DEFAULT_FARM_LOCATION;
  }

  /**
   * Set the active location explicitly
   */
  setActiveLocation(location) {
    if (!location) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(location));
    } catch {
      // Ignore
    }
  }

  /**
   * Request browser GPS geolocation
   */
  async requestBrowserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            name: 'Current Location',
            district: '',
            state: '',
            country: 'India',
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            type: 'browser_gps',
          };
          this.setActiveLocation(loc);
          resolve(loc);
        },
        (error) => {
          let msg = 'Unable to retrieve your location.';
          if (error.code === error.PERMISSION_DENIED) {
            msg = 'Location access was denied. You can search your town or village manually.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            msg = 'Location information is currently unavailable.';
          } else if (error.code === error.TIMEOUT) {
            msg = 'Location request timed out. Please try again.';
          }
          reject(new Error(msg));
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  }

  /**
   * Clear session location and reset to saved farm
   */
  resetToSavedFarm(userFarms = []) {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
    return this.getActiveLocation(userFarms);
  }
}

export const locationService = new LocationService();
