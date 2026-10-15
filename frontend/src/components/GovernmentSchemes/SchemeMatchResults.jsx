import React from 'react';
import {
  Sparkles,
  ArrowLeft,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Filter
} from 'lucide-react';
import SchemeCard from './SchemeCard';

export default function SchemeMatchResults({
  results = [],
  profile = {},
  onResetMatch,
  onViewDetails,
  onSaveScheme,
  savedSchemeIds = new Set()
}) {
  return (
    <section className="space-y-6">

      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/15 border border-amber-500/30 rounded-full text-xs font-bold text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Recommendation Results</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              Schemes Recommended for You ({results.length})
            </h2>
            <p className="text-xs text-slate-300">
              Ranked by <strong>AgriQura Relevance</strong> based on your location, landholding, crop, and support needs.
            </p>
          </div>

          <button
            onClick={onResetMatch}
            className="self-start sm:self-center px-4 py-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Change Profile Preferences</span>
          </button>
        </div>

        {/* Profile Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 text-xs">
          <span className="text-slate-400 font-semibold">Matched for:</span>
          {profile.state && (
            <span className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded-lg border border-slate-700 font-medium">
              📍 {profile.state}
            </span>
          )}
          {profile.farmerType && (
            <span className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded-lg border border-slate-700 font-medium">
              👨‍🌾 {profile.farmerType}
            </span>
          )}
          {profile.crop && (
            <span className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded-lg border border-slate-700 font-medium">
              🌾 {profile.crop}
            </span>
          )}
          {profile.landholding && (
            <span className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded-lg border border-slate-700 font-medium">
              📐 {profile.landholding} {profile.exactAcres ? `(${profile.exactAcres} acres)` : ''}
            </span>
          )}
          {profile.needs && profile.needs.length > 0 && (
            <span className="px-2.5 py-1 bg-amber-500/10 text-amber-300 rounded-lg border border-amber-500/30 font-medium">
              🎯 {profile.needs.join(', ')}
            </span>
          )}
        </div>

        {/* Mandatory Advisory Trust Rule Notice */}
        <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl text-[11px] text-slate-400 leading-relaxed flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Official Advisory Notice:</strong> Scheme recommendations and relevance scores are AgriQura's advisory estimate. Final qualification and document approvals are determined exclusively by the respective Central or State Government authority.
          </span>
        </div>
      </div>

      {/* Recommended Grid */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((scheme) => (
            <SchemeCard
              key={scheme.schemeId || scheme.id}
              scheme={scheme}
              onViewDetails={onViewDetails}
              onSaveScheme={onSaveScheme}
              isSaved={savedSchemeIds.has(scheme.schemeId || scheme.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4">
          <p className="text-slate-300 text-sm">No specific high-relevance match found for this combination.</p>
          <button
            onClick={onResetMatch}
            className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
          >
            Adjust Search Criteria
          </button>
        </div>
      )}

    </section>
  );
}
