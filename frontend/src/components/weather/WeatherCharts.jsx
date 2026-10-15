import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, BarChart2, Droplets } from 'lucide-react';

export default function WeatherCharts({ daily = [], hourly = [] }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('temp'); // 'temp' | 'rain'
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!daily || daily.length === 0) return null;

  // Temperature Chart Calculations
  const chartDays = daily.slice(0, 14);
  const minTempAll = Math.min(...chartDays.map((d) => d.minTemp));
  const maxTempAll = Math.max(...chartDays.map((d) => d.maxTemp));
  const yPadding = 4;
  const yMin = minTempAll - yPadding;
  const yMax = maxTempAll + yPadding;
  const ySpan = Math.max(yMax - yMin, 1);

  const svgWidth = 700;
  const svgHeight = 220;
  const paddingX = 35;
  const paddingY = 30;
  const usableWidth = svgWidth - paddingX * 2;
  const usableHeight = svgHeight - paddingY * 2;

  const getX = (idx) => paddingX + (idx / Math.max(chartDays.length - 1, 1)) * usableWidth;
  const getY = (val) => svgHeight - paddingY - ((val - yMin) / ySpan) * usableHeight;

  // Generate SVG Points for Max Temp & Min Temp Curves
  const maxPoints = chartDays.map((d, i) => `${getX(i)},${getY(d.maxTemp)}`).join(' ');
  const minPoints = chartDays.map((d, i) => `${getX(i)},${getY(d.minTemp)}`).join(' ');

  // Area Path
  const areaPoints = [
    ...chartDays.map((d, i) => `${getX(i)},${getY(d.maxTemp)}`),
    ...[...chartDays].reverse().map((d, i) => `${getX(chartDays.length - 1 - i)},${getY(d.minTemp)}`),
  ].join(' ');

  return (
    <div className="glass-card p-5 sm:p-6 space-y-4 border-slate-800">
      {/* Chart Header & Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <span>Agricultural Trend Charts</span>
        </h3>

        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('temp')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'temp'
                ? 'bg-agri-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Temperature Trend (14 Days)
          </button>
          <button
            onClick={() => setActiveTab('rain')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'rain'
                ? 'bg-sky-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Precipitation & Rain Probability
          </button>
        </div>
      </div>

      {/* ───── 1. Temperature Curve Chart ───── */}
      {activeTab === 'temp' && (
        <div className="space-y-2">
          <div className="w-full overflow-x-auto no-scrollbar">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-48 sm:h-56 min-w-[500px]"
            >
              <defs>
                <linearGradient id="tempAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} stroke="#334155" strokeDasharray="3 3" strokeOpacity="0.4" />
              <line x1={paddingX} y1={svgHeight / 2} x2={svgWidth - paddingX} y2={svgHeight / 2} stroke="#334155" strokeDasharray="3 3" strokeOpacity="0.4" />
              <line x1={paddingX} y1={svgHeight - paddingY} x2={svgWidth - paddingX} y2={svgHeight - paddingY} stroke="#334155" strokeOpacity="0.6" />

              {/* Gradient Temperature Band */}
              <polygon points={areaPoints} fill="url(#tempAreaGradient)" />

              {/* Max Temp Line (Warm Orange) */}
              <polyline fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={maxPoints} />

              {/* Min Temp Line (Cool Sky Blue) */}
              <polyline fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 4" points={minPoints} />

              {/* Data Points & Labels */}
              {chartDays.map((d, i) => {
                const cx = getX(i);
                const cyMax = getY(d.maxTemp);
                const cyMin = getY(d.minTemp);
                const dateLabel = new Date(d.date).toLocaleDateString([], { weekday: 'narrow' });
                const isHovered = hoveredIdx === i;

                return (
                  <g
                    key={i}
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    className="cursor-pointer"
                  >
                    {/* Vertical guide line on hover */}
                    {isHovered && (
                      <line x1={cx} y1={paddingY} x2={cx} y2={svgHeight - paddingY} stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
                    )}

                    {/* Max Point */}
                    <circle cx={cx} cy={cyMax} r={isHovered ? 5 : 3.5} fill="#f59e0b" stroke="#0f172a" strokeWidth="2" />
                    <text x={cx} y={cyMax - 8} textAnchor="middle" fill="#fde68a" fontSize="10" fontWeight="bold">
                      {d.maxTemp}°
                    </text>

                    {/* Min Point */}
                    <circle cx={cx} cy={cyMin} r={isHovered ? 4.5 : 3} fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
                    <text x={cx} y={cyMin + 14} textAnchor="middle" fill="#93c5fd" fontSize="9">
                      {d.minTemp}°
                    </text>

                    {/* X-axis date label */}
                    <text x={cx} y={svgHeight - 10} textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="600">
                      {dateLabel}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span>Max Temperature (°C)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-sky-400" />
              <span>Min Temperature (°C)</span>
            </span>
          </div>
        </div>
      )}

      {/* ───── 2. Precipitation Probability & Rainfall Bar Chart ───── */}
      {activeTab === 'rain' && (
        <div className="space-y-4">
          <div className="grid grid-cols-7 sm:grid-cols-14 gap-2 pt-2 items-end h-44 sm:h-52">
            {chartDays.map((d, i) => {
              const rainProb = d.precipitationProbability ?? 0;
              const rainMm = d.precipitation ?? 0;
              const dateStr = new Date(d.date).toLocaleDateString([], { weekday: 'short' });

              return (
                <div key={i} className="flex flex-col items-center justify-end h-full group">
                  {/* Tooltip on Hover */}
                  <span className="text-[10px] text-sky-300 font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-1">
                    {rainProb}% ({rainMm}mm)
                  </span>

                  {/* Probability Bar */}
                  <div className="w-full bg-slate-800 rounded-t-lg relative flex flex-col justify-end overflow-hidden h-28 sm:h-32">
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 via-sky-500 to-cyan-400 rounded-t-lg transition-all duration-300"
                      style={{ height: `${Math.max(rainProb, 4)}%` }}
                    />
                  </div>

                  <span className="text-[10px] font-semibold text-slate-400 mt-1 truncate">
                    {dateStr}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 px-2 pt-1 border-t border-slate-800">
            <span className="flex items-center gap-1.5 text-sky-400">
              <Droplets className="w-3.5 h-3.5" />
              <span>Bar height reflects % chance of precipitation</span>
            </span>
            <span>Hover on any day for exact expected rainfall (mm)</span>
          </div>
        </div>
      )}
    </div>
  );
}
