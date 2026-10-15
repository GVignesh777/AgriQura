import React from 'react';
import { Landmark, Building2, Globe } from 'lucide-react';

export default function CentralVsStateToggle({
  activeLevel = 'All',
  onSelectLevel,
  selectedState = 'All'
}) {
  return (
    <div className="inline-flex p-1 bg-slate-900 border border-slate-800 rounded-2xl gap-1">
      <button
        onClick={() => onSelectLevel('All')}
        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
          activeLevel === 'All'
            ? 'bg-amber-500 text-slate-950 shadow-md'
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }`}
      >
        <Globe className="w-3.5 h-3.5" />
        <span>All India</span>
      </button>

      <button
        onClick={() => onSelectLevel('Central')}
        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
          activeLevel === 'Central'
            ? 'bg-amber-500 text-slate-950 shadow-md'
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }`}
      >
        <Landmark className="w-3.5 h-3.5" />
        <span>Central Schemes</span>
      </button>

      <button
        onClick={() => onSelectLevel('State')}
        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
          activeLevel === 'State'
            ? 'bg-emerald-500 text-slate-950 shadow-md'
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }`}
      >
        <Building2 className="w-3.5 h-3.5" />
        <span>{selectedState && selectedState !== 'All' ? `${selectedState} State` : 'State Schemes'}</span>
      </button>
    </div>
  );
}
