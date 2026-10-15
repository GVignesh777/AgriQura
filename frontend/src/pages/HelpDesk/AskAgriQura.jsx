import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Mic, Sparkles, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AskAgriQura() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-agri-950 via-slate-900 to-emerald-950/70 border border-agri-500/30 p-6 sm:p-8 lg:p-10 shadow-2xl">
        {/* Subtle Ambient Node Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-agri-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-emerald-600/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Left Content */}
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-agri-500/15 border border-agri-500/30 rounded-full text-agri-300 text-xs font-bold tracking-wide">
              {/* Subtle Pulsing Node */}
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-agri-400 opacity-75 motion-reduce:hidden" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-agri-500" />
              </span>
              <span>Direct Groq Llama-3 AI Engine</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Can't find what you're looking for?
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Ask AgriQura AI to get personalized fertilizer doses, pest control remedies, and localized weather advisories tailored to your specific crop in under 2 seconds.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Low Latency AI</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Agronomist Verified Guidance</span>
              </span>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            <Link
              to="/assistant"
              className="btn-primary py-3.5 px-6 text-sm font-bold shadow-lg shadow-agri-950/60"
            >
              <Cpu className="w-4 h-4 text-white" />
              <span>Ask AgriQura AI</span>
              <ArrowRight className="w-4 h-4 text-white/80" />
            </Link>

            <Link
              to="/assistant"
              className="btn-secondary py-3.5 px-5 text-sm font-semibold bg-slate-900/90 border-slate-700/80 hover:border-slate-600 text-slate-200"
            >
              <Mic className="w-4 h-4 text-emerald-400" />
              <span>Voice & Text AI</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
