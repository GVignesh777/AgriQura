import React from 'react';
import {
  Filter,
  X,
  RotateCcw,
  Sparkles,
  ArrowUpDown,
  CheckCircle2
} from 'lucide-react';
import CentralVsStateToggle from './CentralVsStateToggle';

const SCHEME_CATEGORIES = [
  'All',
  'Financial Assistance',
  'Crop Insurance',
  'Irrigation',
  'Solar & Renewable Energy',
  'Farm Machinery & Equipment',
  'Credit & Loans',
  'Soil Health & Fertilizer',
  'Horticulture & Seeds',
  'Storage & Infrastructure'
];

export default function SchemeFilters({
  selectedCategory = 'All',
  onSelectCategory,
  selectedLevel = 'All',
  onSelectLevel,
  selectedState = 'All',
  onSelectState,
  states = [],
  selectedFarmerType = 'All',
  onSelectFarmerType,
  selectedCrop = 'All',
  onSelectCrop,
  sortOption = 'recommended',
  onSelectSort,
  onResetFilters,
  totalResultCount = 0,
  hasActiveFilters = false
}) {
  return (
    <div className="space-y-4">

      {/* Top Filter Bar: Central/State toggle + State + Sorting + Count */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 bg-slate-900/90 border border-slate-800 rounded-2xl">
        
        {/* Left: Level Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <CentralVsStateToggle
            activeLevel={selectedLevel}
            onSelectLevel={onSelectLevel}
            selectedState={selectedState}
          />

          {/* Quick State Dropdown */}
          <select
            value={selectedState}
            onChange={(e) => onSelectState(e.target.value)}
            className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="All">All States</option>
            {states
              .filter((s) => s.name !== 'All States & UTs')
              .map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
          </select>
        </div>

        {/* Right: Sorting + Reset + Live Count */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Live Result Count */}
          <span className="text-xs font-semibold text-slate-300">
            Showing <strong className="text-amber-400 font-extrabold">{totalResultCount}</strong>{' '}
            {selectedState !== 'All' ? `${selectedState} & Central schemes` : 'schemes'}
          </span>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sortOption}
              onChange={(e) => onSelectSort(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="recommended">Recommended First</option>
              <option value="name_asc">Name (A to Z)</option>
              <option value="recently_updated">Recently Updated</option>
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs flex items-center gap-1 transition-colors border border-slate-700"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset</span>
            </button>
          )}
        </div>

      </div>

      {/* Category Chips Scroll Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
        {SCHEME_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{cat}</span>
              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950 shrink-0" />}
            </button>
          );
        })}
      </div>

    </div>
  );
}
