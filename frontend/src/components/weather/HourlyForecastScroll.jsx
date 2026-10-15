import React from 'react';
import { useTranslation } from 'react-i18next';
import WeatherIcon from './WeatherIcons';
import { Clock, Droplets } from 'lucide-react';

export default function HourlyForecastScroll({ hourly = [] }) {
  const { t } = useTranslation();
  if (!hourly || hourly.length === 0) return null;

  const formatHour = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
    } catch {
      return isoString?.split('T')?.[1]?.slice(0, 5) || isoString;
    }
  };

  const getDayLabel = (isoString) => {
    try {
      const date = new Date(isoString);
      const today = new Date();
      if (date.getDate() === today.getDate()) return 'Today';
      return date.toLocaleDateString([], { weekday: 'short' });
    } catch {
      return '';
    }
  };

  return (
    <div className="glass-card p-5 sm:p-6 space-y-4 border-slate-800">
      <div className="flex items-center justify-between">
        <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          <span>Hourly Agricultural Forecast (Next 48 Hours)</span>
        </h3>
        <span className="text-xs text-slate-400 font-medium">Scroll horizontally →</span>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 no-scrollbar scroll-smooth">
        {hourly.map((item, idx) => {
          const isNow = idx === 0;

          return (
            <div
              key={idx}
              className={`flex flex-col items-center justify-between p-3.5 rounded-2xl border min-w-[90px] shrink-0 transition-all ${
                isNow
                  ? 'bg-agri-600/20 border-agri-500/50 shadow-md shadow-agri-950/40 ring-1 ring-agri-500/30'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-slate-400">
                {isNow ? 'Now' : getDayLabel(item.time)}
              </span>
              <span className="text-xs font-bold text-slate-200 mt-0.5">
                {formatHour(item.time)}
              </span>

              <div className="my-2.5">
                <WeatherIcon icon={item.icon} className="w-7 h-7" />
              </div>

              <span className="text-sm font-extrabold text-white">
                {item.temperature}°C
              </span>

              {/* Rain Probability Pill */}
              <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full">
                <Droplets className="w-3 h-3" />
                <span>{item.precipitationProbability}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
