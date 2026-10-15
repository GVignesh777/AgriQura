import React, { useState } from 'react';
import {
  BookOpen,
  Clock,
  ArrowRight,
  Sparkles,
  Leaf,
  Bug,
  Shield,
  Sprout,
  Droplets,
  Tractor,
  CloudRain,
  Landmark,
  X,
  CheckCircle2,
} from 'lucide-react';

const iconMap = {
  Leaf,
  Bug,
  Shield,
  Sprout,
  Droplets,
  Tractor,
  CloudRain,
  Landmark,
};

export default function KnowledgeCenter({
  resources = [],
  loading = false,
  error = null,
  onRetry,
}) {
  const [selectedResource, setSelectedResource] = useState(null);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-agri-400 text-xs font-bold uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Agronomy Knowledge Base</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Agricultural Guides & Best Practices
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md">
          Verified research-backed publications and field guidelines compiled by certified agronomists.
        </p>
      </div>

      {/* Loading Skeleton State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-slate-800" />
                <div className="w-16 h-4 rounded bg-slate-800" />
              </div>
              <div className="space-y-2">
                <div className="w-3/4 h-5 rounded bg-slate-800" />
                <div className="w-full h-3 rounded bg-slate-800" />
                <div className="w-5/6 h-3 rounded bg-slate-800" />
              </div>
              <div className="w-20 h-4 rounded bg-slate-800 pt-2" />
            </div>
          ))}
        </div>
      ) : error ? (
        /* Error with Retry State */
        <div className="p-8 text-center bg-slate-900/60 border border-rose-500/30 rounded-2xl max-w-lg mx-auto space-y-3">
          <p className="text-sm text-rose-400">Failed to load guides: {error}</p>
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl text-white transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : resources.length === 0 ? (
        /* Empty State */
        <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-2xl">
          <p className="text-sm text-slate-400">No knowledge resources currently available.</p>
        </div>
      ) : (
        /* Resource Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {resources.map((res) => {
            const IconComp = iconMap[res.icon] || BookOpen;

            return (
              <div
                key={res.id}
                className="group flex flex-col justify-between p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-agri-500/40 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                <div>
                  {/* Top Category & Read Time */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-agri-400 border border-slate-700/80 uppercase tracking-wider">
                      {res.category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {res.readTime}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-3 mb-2.5">
                    <div className="w-8 h-8 rounded-lg bg-agri-500/10 border border-agri-500/20 flex items-center justify-center shrink-0 text-agri-400 group-hover:bg-agri-500/20 transition-colors">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-100 group-hover:text-agri-300 transition-colors leading-snug line-clamp-2">
                      {res.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                    {res.description}
                  </p>
                </div>

                {/* Footer CTA */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">{res.author}</span>
                  <button
                    onClick={() => setSelectedResource(res)}
                    className="flex items-center gap-1 text-xs font-semibold text-agri-400 group-hover:text-agri-300 transition-colors"
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Guide Reader Modal */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 shadow-2xl rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 relative animate-fade-in-down">
            <button
              onClick={() => setSelectedResource(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-agri-500/15 text-agri-400 border border-agri-500/25 uppercase">
                  {selectedResource.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedResource.readTime}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white">
                {selectedResource.title}
              </h3>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <p className="font-semibold text-agri-300">Executive Summary:</p>
                <p>{selectedResource.description}</p>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <h4 className="font-bold text-white text-sm">Key Agronomic Recommendations:</h4>
                <ul className="space-y-1.5 list-disc pl-4 text-slate-400">
                  <li>Follow standard dosage metrics and timing based on crop growth phase.</li>
                  <li>Maintain 65-75% soil moisture capacity before pesticide and foliar fertilizer sprays.</li>
                  <li>Verify certified seed batches with National Seeds Corporation seal.</li>
                  <li>Consult localized Mandi arrivals to time commercial crop sales profitably.</li>
                </ul>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {selectedResource.tags?.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-medium"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Published by: {selectedResource.author}</span>
                <button
                  onClick={() => setSelectedResource(null)}
                  className="px-4 py-2 bg-agri-600 hover:bg-agri-500 text-white font-semibold rounded-xl transition-colors"
                >
                  Done Reading
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
