import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import WeatherIcon from './WeatherIcons';
import { Calendar, Droplets, Wind, ChevronDown, ChevronUp } from 'lucide-react';

export default function DailyForecastList({ daily = [] }) {
  const { t } = useTranslation();
  const [showAllDays, setShowAllDays] = useState(false);

  if (!daily || daily.length === 0) return null;

  const displayDays = showAllDays ? daily : daily.slice(0, 7);

  const formatDate = (isoString, idx) => {
    if (idx === 0) return { day: 'Today', dateStr: 'Today' };
    if (idx === 1) return { day: 'Tomorrow', dateStr: 'Tomorrow' };

    try {
      const date = new Date(isoString);
      return {
        day: date.toLocaleDateString([], { weekday: 'short' }),
        dateStr: date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      };
    } catch {
      return { day: `Day ${idx + 1}`, dateStr: isoString };
    }
  };

  // Find absolute min/max across all displayed days for dynamic temperature range bar
  const globalMin = Math.min(...daily.map((d) => d.minTemp || 20));
  const globalMax = Math.max(...daily.map((d) => d.maxTemp || 40));
  const tempSpan = Math.max(globalMax - globalMin, 1);

  return (
    <div className="glass-card p-5 sm:p-6 space-y-4 border-slate-800">
      <div className="flex items-center justify-between">
        <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-agri-400" />
          <span>{showAllDays ? '16-Day Extended Agricultural Forecast' : '7-Day Agricultural Forecast'}</span>
        </h3>

        <button
          onClick={() => setShowAllDays((prev) => !prev)}
          className="text-xs font-semibold text-agri-400 hover:text-agri-300 flex items-center gap-1 transition-colors"
        >
          <span>{showAllDays ? 'Show 7 Days' : 'Show 16 Days'}</span>
          {showAllDays ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="space-y-2.5">
        {displayDays.map((dayItem, idx) => {
          const { day, dateStr } = formatDate(dayItem.date, idx);
          const isToday = idx === 0;

          // Compute percentage position for the mini temperature range bar
          const minPercent = Math.max(0, Math.min(100, ((dayItem.minTemp - globalMin) / tempSpan) * 100));
          const maxPercent = Math.max(0, Math.min(100, ((dayItem.maxTemp - globalMin) / tempSpan) * 100));
          const barWidth = Math.max(maxPercent - minPercent, 8);

          return (
            <div
              key={idx}
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-2xl border transition-all gap-3 ${
                isToday
                  ? 'bg-slate-900/90 border-agri-500/40 shadow-sm'
                  : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/50 hover:border-slate-700'
              }`}
            >
              {/* Day & Condition */}
              <div className="flex items-center gap-3 sm:w-1/3">
                <div className="w-9 h-9 rounded-xl bg-slate-800/80 flex items-center justify-center shrink-0">
                  <WeatherIcon icon={dayItem.icon} className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <span>{day}</span>
                    {isToday && (
                      <span className="text-[10px] bg-agri-500/20 text-agri-300 px-1.5 py-0.2 rounded font-semibold">
                        Today
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-slate-400 capitalize truncate">
                    {dateStr} • {dayItem.condition}
                  </p>
                </div>
              </div>

              {/* Rain Probability & Precipitation */}
              <div className="flex items-center gap-4 text-xs shrink-0 sm:w-1/4">
                <div className="flex items-center gap-1.5 text-sky-400 font-semibold">
                  <Droplets className="w-3.5 h-3.5" />
                  <span>{dayItem.precipitationProbability}%</span>
                  {dayItem.precipitation > 0 && (
                    <span className="text-[10px] text-slate-400">({dayItem.precipitation}mm)</span>
                  )}
                </div>
                <div className="hidden sm:flex items-center gap-1 text-slate-400 text-[11px]">
                  <Wind className="w-3 h-3" />
                  <span>{dayItem.windSpeedMax} km/h</span>
                </div>
              </div>

              {/* Min/Max Temperature Visual Bar */}
              <div className="flex items-center gap-3 sm:w-1/3 justify-end">
                <span className="text-xs font-semibold text-slate-400 w-8 text-right">
                  {dayItem.minTemp}°
                </span>

                <div className="w-24 sm:w-32 h-2 bg-slate-800 rounded-full relative overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-blue-400 via-amber-400 to-red-400"
                    style={{
                      left: `${minPercent}%`,
                      width: `${barWidth}%`,
                    }}
                  />
                </div>

                <span className="text-xs font-bold text-white w-8 text-left">
                  {dayItem.maxTemp}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
