import React from 'react';
import {
  Landmark,
  ExternalLink,
  CheckCircle2,
  Bookmark,
  Sparkles,
  Calendar,
  ShieldCheck,
  Building,
  ArrowRight
} from 'lucide-react';

export default function SchemeCard({
  scheme,
  onViewDetails,
  onSaveScheme,
  isSaved = false
}) {
  const isStateScheme = scheme.governmentLevel === 'State';
  const match = scheme.match;

  return (
    <div className="glass-card p-6 flex flex-col justify-between border-slate-800 hover:border-amber-500/40 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-black/40 group relative overflow-hidden">
      
      {/* Top Accent for State vs Central */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${
          isStateScheme ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-amber-500 to-orange-400'
        }`}
      />

      <div className="space-y-4">
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Central / State Badge */}
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                isStateScheme
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              }`}
            >
              {isStateScheme ? `${scheme.state} State Scheme` : 'Central Scheme'}
            </span>

            {/* Category Tag */}
            <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded-md">
              {scheme.category}
            </span>
          </div>

          {/* Bookmark Button */}
          {onSaveScheme && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSaveScheme(scheme);
              }}
              className={`p-1.5 rounded-lg border transition-colors ${
                isSaved
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title={isSaved ? 'Scheme Saved' : 'Save Scheme to Profile'}
              aria-label="Save Scheme"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400' : ''}`} />
            </button>
          )}
        </div>

        {/* Scheme Name */}
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-white group-hover:text-amber-300 transition-colors leading-snug line-clamp-2">
            {scheme.name}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 line-clamp-1">
            <Building className="w-3 h-3 text-slate-500 shrink-0" />
            <span>{scheme.ministry || scheme.department}</span>
          </p>
        </div>

        {/* AgriQura Relevance Match Badge (if matched from wizard or recommendation) */}
        {match && (
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-amber-300">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>AgriQura Relevance: {match.relevanceLabel}</span>
              </span>
              <span className="text-[10px] font-normal text-amber-400/80">Likely relevant</span>
            </div>
            {match.matchReasons && match.matchReasons.length > 0 && (
              <p className="text-[11px] text-slate-300 leading-tight">
                • {match.matchReasons[0]}
              </p>
            )}
          </div>
        )}

        {/* Description */}
        <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
          {scheme.shortDescription}
        </p>

        {/* Key Benefit Highlight */}
        <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
          <p className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 tracking-wider">
            <CheckCircle2 className="w-3 h-3 text-agri-400" /> Key Benefit
          </p>
          <p className="text-xs font-semibold text-white">
            {scheme.benefits?.amountText && (
              <span className="text-emerald-400 font-bold mr-1.5">{scheme.benefits.amountText}:</span>
            )}
            {scheme.benefits?.summary}
          </p>
        </div>
      </div>

      {/* Footer Info & Action Buttons */}
      <div className="pt-4 mt-4 border-t border-slate-800/80 space-y-3">
        {/* Source & Updated date */}
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="truncate max-w-[170px]" title={scheme.officialSource}>
            Source: {scheme.officialSource}
          </span>
          <span className="shrink-0 flex items-center gap-1 text-slate-400">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>Updated {scheme.lastUpdated}</span>
          </span>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onViewDetails(scheme)}
            className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold rounded-xl transition-colors text-center"
          >
            View Details
          </button>

          {scheme.applicationUrl ? (
            <a
              href={scheme.applicationUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold rounded-xl transition-all shadow-md shadow-amber-950/40 flex items-center justify-center gap-1"
            >
              <span>Apply</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <button
              onClick={() => onViewDetails(scheme)}
              className="w-full py-2.5 px-3 bg-slate-800 text-slate-400 text-xs font-bold rounded-xl cursor-not-allowed"
            >
              Offline / CSC
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
