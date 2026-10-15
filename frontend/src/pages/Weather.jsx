import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { weatherService } from '../services/weatherService';
import { locationService } from '../services/locationService';
import WeatherHero from '../components/weather/WeatherHero';
import HourlyForecastScroll from '../components/weather/HourlyForecastScroll';
import DailyForecastList from '../components/weather/DailyForecastList';
import WeatherCharts from '../components/weather/WeatherCharts';
import AgriAdvisoryCards from '../components/weather/AgriAdvisoryCards';
import LocationSearchBar from '../components/weather/LocationSearchBar';
import WeatherSkeleton from '../components/weather/WeatherSkeleton';
import {
  CloudSun,
  AlertCircle,
  RefreshCw,
  RotateCcw,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export default function Weather() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [activeLocation, setActiveLocation] = useState(() =>
    locationService.getActiveLocation(user?.farms)
  );
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch forecast for active location
  const fetchWeather = useCallback(async (location, isRefresh = false) => {
    if (!location || !location.latitude || !location.longitude) return;

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setErrorMessage('');

    try {
      const data = await weatherService.getForecast({
        lat: location.latitude,
        lon: location.longitude,
        locationName: location.displayText || location.name,
        state: location.state,
        refresh: isRefresh,
      });

      if (data) {
        setWeatherData(data);
      } else {
        setErrorMessage('Unable to retrieve weather data for this location. Please try again.');
      }
    } catch (err) {
      console.error('❌ [Weather Page Error]:', err);
      setErrorMessage(
        'Unable to reach weather services at the moment. Please check your internet connection or try searching another location.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchWeather(activeLocation);
  }, [activeLocation, fetchWeather]);

  // Handle Location Selected from Search
  const handleSelectLocation = (newLoc) => {
    setActiveLocation(newLoc);
    fetchWeather(newLoc);
  };

  // Handle GPS "Use My Location"
  const handleUseGps = async () => {
    setGpsLoading(true);
    try {
      const gpsLoc = await locationService.requestBrowserLocation();
      setActiveLocation(gpsLoc);
      fetchWeather(gpsLoc);
    } catch (err) {
      setErrorMessage(err.message || 'Location access denied or unavailable.');
    } finally {
      setGpsLoading(false);
    }
  };

  // Handle Manual Refresh
  const handleRefresh = () => {
    fetchWeather(activeLocation, true);
  };

  // Reset to Saved Farm Location
  const handleResetFarm = () => {
    const farmLoc = locationService.resetToSavedFarm(user?.farms);
    setActiveLocation(farmLoc);
    fetchWeather(farmLoc);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* ───── Top Header & Search Bar ───── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-semibold mb-2">
            <CloudSun className="w-3.5 h-3.5" />
            <span>Open-Meteo Verified Agricultural Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-display">
            {t('weather.title', 'Weather Intelligence & Agricultural Advisory')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t('weather.subtitle', 'Converts raw weather telemetry into actionable agronomic decisions.')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <LocationSearchBar
            onSelectLocation={handleSelectLocation}
            onUseGps={handleUseGps}
            isGpsLoading={gpsLoading}
          />

          {activeLocation?.type !== 'saved_farm' && (
            <button
              onClick={handleResetFarm}
              className="px-3 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0 transition-all"
              title="Reset to Saved Farm Location"
            >
              <RotateCcw className="w-3.5 h-3.5 text-agri-400" />
              <span className="hidden sm:inline">My Farm</span>
            </button>
          )}
        </div>
      </div>

      {/* ───── Error Banner ───── */}
      {errorMessage && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-between gap-3 text-red-300 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={handleRefresh}
            className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 rounded-xl font-bold transition-all text-xs shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* ───── Main Dashboard Content ───── */}
      {loading ? (
        <WeatherSkeleton />
      ) : weatherData ? (
        <div className="space-y-6 sm:space-y-8">
          {/* 1. Weather Hero Card */}
          <WeatherHero
            weather={weatherData}
            location={activeLocation}
            onRefresh={handleRefresh}
            isRefreshing={refreshing}
          />

          {/* 2. Hourly 48-Hour Forecast */}
          <HourlyForecastScroll hourly={weatherData.hourly} />

          {/* 3. Agricultural Intelligence: Risks, Activity Decisions & AI Agronomist */}
          <AgriAdvisoryCards
            weather={weatherData}
            currentCrop={user?.farms?.[0]?.crop || 'Cotton'}
          />

          {/* 4. Charts: 14-Day Temperature Trend & Precipitation Bar Chart */}
          <WeatherCharts
            daily={weatherData.daily}
            hourly={weatherData.hourly}
          />

          {/* 5. 16-Day Extended Daily Forecast */}
          <DailyForecastList daily={weatherData.daily} />
        </div>
      ) : null}

    </div>
  );
}
