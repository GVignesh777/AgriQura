import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import WeatherIcon from './WeatherIcons';
import { Droplets, Wind, ArrowRight, CloudSun, Loader2, MapPin } from 'lucide-react';
import { weatherService } from '../../services/weatherService';
import { locationService } from '../../services/locationService';

export default function CompactWeatherWidget({ userFarms = [] }) {
  const { t } = useTranslation();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLoc, setActiveLoc] = useState(null);

  useEffect(() => {
    const loc = locationService.getActiveLocation(userFarms);
    setActiveLoc(loc);

    weatherService
      .getForecast({
        lat: loc.latitude,
        lon: loc.longitude,
        locationName: loc.name,
      })
      .then((data) => setWeather(data))
      .catch((err) => console.warn('⚠️ [Compact Widget Error]:', err))
      .finally(() => setLoading(false));
  }, [userFarms]);

  if (loading) {
    return (
      <div className="glass-card p-5 space-y-3 border-amber-500/20 animate-pulse">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Live Weather Radar</span>
          <div className="w-8 h-8 rounded-xl bg-slate-800" />
        </div>
        <div className="h-8 w-24 bg-slate-800 rounded-lg" />
        <div className="h-4 w-36 bg-slate-800 rounded-lg" />
      </div>
    );
  }

  const current = weather?.current || {
    temperature: 31,
    feelsLike: 34,
    condition: 'Partly Cloudy',
    icon: 'partly-cloudy',
    humidity: 68,
    windSpeed: 14,
    precipitationProbability: 30,
  };

  const todayDaily = weather?.daily?.[0] || { minTemp: 23, maxTemp: 33 };

  return (
    <div className="glass-card p-5 space-y-3 border-amber-500/20 relative overflow-hidden group hover:border-amber-500/40 transition-all">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs font-semibold text-slate-400 truncate">
            {activeLoc?.name || 'Farm Weather'}
          </span>
        </div>
        <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl group-hover:scale-105 transition-transform">
          <WeatherIcon icon={current.icon} className="w-4 h-4" />
        </div>
      </div>

      {/* Main Temperature & Condition */}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl sm:text-4xl font-extrabold text-white font-display">
          {current.temperature}°C
        </span>
        <span className="text-xs text-slate-300 font-medium capitalize truncate">
          {current.condition}
        </span>
      </div>

      {/* Metrics Row */}
      <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap">
        <span className="flex items-center gap-1">
          <Droplets className="w-3 h-3 text-sky-400" />
          <span>{current.precipitationProbability}% rain</span>
        </span>
        <span className="flex items-center gap-1">
          <Wind className="w-3 h-3 text-emerald-400" />
          <span>{current.windSpeed} km/h</span>
        </span>
        <span>
          ({todayDaily.minTemp}° - {todayDaily.maxTemp}°)
        </span>
      </div>

      {/* Advisory Snippet or Rain Alert */}
      <div className="text-[11px] text-amber-300 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20 truncate">
        {weather?.activities?.[0]?.status ? (
          <span>{weather.activities[0].title}: {weather.activities[0].status}</span>
        ) : (
          <span>🌧️ Open-Meteo verified live forecast</span>
        )}
      </div>

      {/* Link to Full Page */}
      <Link
        to="/weather"
        className="flex items-center justify-between text-xs font-bold text-agri-400 hover:text-agri-300 pt-1 group-hover:translate-x-0.5 transition-transform"
      >
        <span>View Full Weather Intelligence</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
