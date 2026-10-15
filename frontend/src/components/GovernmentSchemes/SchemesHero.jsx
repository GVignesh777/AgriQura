import React from 'react';
import {
  Landmark,
  Search,
  Mic,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Filter,
  CheckCircle2,
  Building2,
  Compass
} from 'lucide-react';

export default function SchemesHero({
  searchQuery,
  onSearchChange,
  selectedState,
  onStateChange,
  states = [],
  onOpenWizard,
  onOpenVoice,
  onScrollToSchemes,
  totalSchemes = 0,
  syncInfo = {}
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800/80 p-6 sm:p-10 shadow-2xl">
      {/* Background Subtle Agricultural Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-agri-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="relative z-10 max-w-4xl space-y-6">

        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/15 border border-amber-500/30 rounded-full text-xs font-semibold text-amber-400">
            <Landmark className="w-3.5 h-3.5" />
            <span>Official Government Welfare Directory</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900/90 border border-slate-700/80 rounded-full text-xs font-medium text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-agri-400" />
            <span>Verified Government Scheme Information</span>
          </div>
        </div>

        {/* Main Heading & Subheading */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Government Schemes for <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-agri-400">Indian Farmers</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Discover government schemes, subsidies, and agricultural support programs relevant to your landholding, crop type, and regional state.
          </p>
        </div>

        {/* Interactive Search & Voice Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          {/* Search Input */}
          <div className="sm:col-span-7 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search schemes by name, crop, benefit or department..."
              className="w-full pl-10 pr-12 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/50 transition-all shadow-inner"
            />
            {/* Voice Search Trigger */}
            <button
              onClick={onOpenVoice}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-slate-800 hover:bg-agri-500/20 text-slate-300 hover:text-agri-400 rounded-lg transition-colors"
              title="Search by Voice (Telugu, Hindi, English)"
              aria-label="Voice Search"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>

          {/* State Selector */}
          <div className="sm:col-span-5 relative">
            <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedState}
              onChange={(e) => onStateChange(e.target.value)}
              className="w-full pl-10 pr-8 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/50 appearance-none transition-all cursor-pointer"
            >
              <option value="All">All India (Central + All States)</option>
              {states
                .filter((s) => s.name !== 'All States & UTs')
                .map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name} ({s.count} schemes)
                  </option>
                ))}
            </select>
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
              ▼
            </span>
          </div>
        </div>

        {/* Action CTAs & Quick Metrics */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800/80">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onOpenWizard}
              className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-950/40 hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Find Schemes for Me</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onScrollToSchemes}
              className="px-4 py-3 bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-slate-200 hover:text-white text-sm font-semibold rounded-xl transition-all flex items-center gap-2"
            >
              <Filter className="w-4 h-4 text-slate-400" />
              <span>Browse All Schemes ({totalSchemes})</span>
            </button>
          </div>

          {/* Sync Attribution Notice */}
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Source: myScheme.gov.in (National Portal)</span>
          </div>
        </div>

      </div>
    </section>
  );
}
