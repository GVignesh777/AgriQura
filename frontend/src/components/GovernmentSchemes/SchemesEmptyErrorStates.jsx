import React from 'react';
import {
  RotateCcw,
  AlertTriangle,
  SearchX,
  FileQuestion,
  Filter
} from 'lucide-react';

export function SchemesLoadingSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-5 w-24 bg-slate-800 rounded-md" />
            <div className="h-5 w-16 bg-slate-800 rounded-md" />
          </div>
          <div className="space-y-2">
            <div className="h-6 w-3/4 bg-slate-800 rounded-md" />
            <div className="h-4 w-1/2 bg-slate-800/60 rounded-md" />
          </div>
          <div className="h-12 w-full bg-slate-800/40 rounded-xl" />
          <div className="h-10 w-full bg-slate-800 rounded-xl" />
        </div>
      ))}
    </div>
  );
}

export function SchemesEmptyState({ onResetFilters, searchQuery }) {
  return (
    <div className="text-center py-16 bg-slate-900/90 border border-slate-800 rounded-3xl p-8 space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
        <SearchX className="w-7 h-7" />
      </div>
      <div className="space-y-1.5 max-w-md mx-auto">
        <h3 className="text-lg font-bold text-white">No Matching Schemes Found</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          {searchQuery
            ? `No schemes found for "${searchQuery}". Try searching for generic keywords like "subsidy", "insurance", "solar", or "credit".`
            : 'Try changing your State filter, crop selection, or switching between Central and State tabs.'}
        </p>
      </div>
      {onResetFilters && (
        <button
          onClick={onResetFilters}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold rounded-xl border border-slate-700 transition-colors inline-flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span>Reset All Filters</span>
        </button>
      )}
    </div>
  );
}

export function SchemesErrorState({ error, onRetry }) {
  return (
    <div className="text-center py-16 bg-slate-900 border border-red-500/20 rounded-3xl p-8 space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center mx-auto">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <div className="space-y-1.5 max-w-md mx-auto">
        <h3 className="text-lg font-bold text-white">Unable to Load Government Scheme Information</h3>
        <p className="text-xs text-slate-400">
          {error || 'An error occurred while connecting to the government schemes service.'}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg transition-colors inline-flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
