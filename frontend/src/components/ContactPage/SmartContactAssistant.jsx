import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';

export default function SmartContactAssistant() {
  return (
    <div className="p-6 sm:p-8 bg-gradient-to-br from-agri-950/40 via-slate-900 to-slate-900 border border-agri-500/30 rounded-3xl space-y-4 shadow-xl">
      <div className="flex items-center gap-2 px-3 py-1 bg-agri-500/15 border border-agri-500/30 rounded-full text-xs font-bold text-agri-400 w-fit">
        <Zap className="w-3.5 h-3.5" />
        <span>Instant AI Advisory</span>
      </div>

      <div className="space-y-1.5">
        <h3 className="text-xl font-extrabold text-white">Need an Instant Answer?</h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          You might not need to wait for a support ticket. AgriQura's Groq-powered AI Assistant can answer crop queries, disease questions, and mandi rates in real-time.
        </p>
      </div>

      <div className="pt-2">
        <Link
          to="/assistant"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-agri-500 hover:bg-agri-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-agri-950/60 transition-all hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask AgriQura AI Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
