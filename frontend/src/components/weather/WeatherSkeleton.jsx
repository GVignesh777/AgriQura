import React from 'react';

export default function WeatherSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top Hero Skeleton */}
      <div className="glass-card p-6 sm:p-8 border-slate-800 space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <div className="h-6 w-48 bg-slate-800 rounded-lg" />
          <div className="h-6 w-24 bg-slate-800 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-slate-800 rounded-3xl" />
            <div className="space-y-2">
              <div className="h-10 w-32 bg-slate-800 rounded-lg" />
              <div className="h-4 w-40 bg-slate-800 rounded-lg" />
            </div>
          </div>
          <div className="h-24 bg-slate-950/70 border border-slate-800 rounded-2xl" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-slate-800">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-950/60 border border-slate-800 rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Hourly Forecast Skeleton */}
      <div className="glass-card p-6 border-slate-800 space-y-4">
        <div className="h-5 w-56 bg-slate-800 rounded-lg" />
        <div className="flex gap-3 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 w-24 bg-slate-950/60 border border-slate-800 rounded-2xl shrink-0" />
          ))}
        </div>
      </div>

      {/* Advisory & Risk Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64 bg-slate-900 border border-slate-800 rounded-3xl" />
        <div className="h-64 bg-slate-900 border border-slate-800 rounded-3xl" />
      </div>
    </div>
  );
}
