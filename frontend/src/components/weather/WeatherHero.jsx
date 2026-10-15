import React from 'react';
import { useTranslation } from 'react-i18next';
import WeatherIcon from './WeatherIcons';
import {
  Thermometer,
  Droplets,
  Wind,
  Compass,
  Gauge,
  Eye,
  Cloud,
  Sunrise,
  Sunset,
  Clock,
  Sparkles,
  MapPin,
  RefreshCw,
} from 'lucide-react';

export default function WeatherHero({ weather, location, onRefresh, isRefreshing }) {
  const { t } = useTranslation();
  if (!weather || !weather.current) return null;

  const current = weather.current;
  const todayDaily = weather.daily?.[0] || {};
  const cacheStatus = weather.metadata?.cacheStatus || 'fresh';
  const provider = weather.metadata?.provider || 'Open-Meteo';

  return (
    <div className="glass-card p-6 sm:p-8 border-agri-500/30 bg-gradient-to-br from-slate-900 via-slate-900/95 to-agri-950/40 relative overflow-hidden shadow-2xl">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-agri-500/20 text-agri-400 rounded-lg">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              {location?.displayText || location?.name || 'Current Farm Location'}
              {location?.type === 'saved_farm' && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  Saved Farm
                </span>
              )}
            </h2>
            <p className="text-[11px] text-slate-400">
              Coordinates: {Number(weather.location?.latitude || 0).toFixed(3)}°N, {Number(weather.location?.longitude || 0).toFixed(3)}°E • Timezone: {weather.location?.timezone || 'Asia/Kolkata'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{provider} Live Telemetry</span>
          </span>

          {cacheStatus === 'cached' && (
            <span className="px-2 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-300 rounded-lg text-[10px]">
              Cached
            </span>
          )}

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 rounded-xl border border-slate-700 transition-all text-xs font-semibold"
            title="Refresh Live Weather"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-agri-400' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Main Hero Temperature & Condition */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-6 items-center">
        
        <div className="lg:col-span-6 flex items-center gap-5 sm:gap-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center p-3 shadow-xl shrink-0">
            <WeatherIcon icon={current.icon} className="w-12 h-12 sm:w-16 sm:h-16" />
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight font-display">
                {current.temperature}°C
              </span>
              <span className="text-xs sm:text-sm text-slate-400 font-semibold">
                Feels like {current.feelsLike}°C
              </span>
            </div>

            <p className="text-lg sm:text-xl font-bold text-agri-300 capitalize">
              {current.condition}
            </p>

            <p className="text-xs text-slate-400">
              Today: Min <span className="text-slate-200 font-semibold">{todayDaily.minTemp ?? '--'}°C</span> • Max <span className="text-slate-200 font-semibold">{todayDaily.maxTemp ?? '--'}°C</span>
            </p>
          </div>
        </div>

        {/* Farmer Plain-Language Weather Summary Banner */}
        <div className="lg:col-span-6 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Agronomic Weather Outlook</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {weather.farmerSummary || 'Calm weather conditions across the field.'}
          </p>
        </div>

      </div>

      {/* Telemetry Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-slate-800">
        
        {/* Humidity */}
        <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-1">
          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
            <Droplets className="w-3.5 h-3.5 text-blue-400" /> Humidity
          </span>
          <p className="text-base sm:text-lg font-bold text-white">{current.humidity}%</p>
        </div>

        {/* Wind Speed & Direction */}
        <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-1">
          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
            <Wind className="w-3.5 h-3.5 text-emerald-400" /> Wind
          </span>
          <p className="text-base sm:text-lg font-bold text-white">{current.windSpeed} <span className="text-xs font-normal text-slate-400">km/h</span></p>
        </div>

        {/* Rain Probability */}
        <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-1">
          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
            <Droplets className="w-3.5 h-3.5 text-sky-400" /> Rain Chance
          </span>
          <p className="text-base sm:text-lg font-bold text-white">{current.precipitationProbability}%</p>
        </div>

        {/* Pressure */}
        <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-1">
          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
            <Gauge className="w-3.5 h-3.5 text-purple-400" /> Pressure
          </span>
          <p className="text-base sm:text-lg font-bold text-white">{current.pressure} <span className="text-xs font-normal text-slate-400">hPa</span></p>
        </div>

        {/* Cloud Cover */}
        <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-1">
          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
            <Cloud className="w-3.5 h-3.5 text-slate-400" /> Cloud Cover
          </span>
          <p className="text-base sm:text-lg font-bold text-white">{current.cloudCover}%</p>
        </div>

        {/* Sunrise & Sunset */}
        <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-1">
          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
            <Sunrise className="w-3.5 h-3.5 text-amber-400" /> Sun
          </span>
          <p className="text-xs sm:text-sm font-bold text-white truncate">
            {current.sunrise} / {current.sunset}
          </p>
        </div>

      </div>
    </div>
  );
}
