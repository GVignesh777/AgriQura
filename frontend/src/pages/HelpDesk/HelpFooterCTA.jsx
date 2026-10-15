import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, PhoneCall, Sparkles, Sprout, ArrowRight } from 'lucide-react';

export default function HelpFooterCTA() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-12 text-center">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-agri-500/5 via-emerald-500/10 to-transparent pointer-events-none" />

        <div className="max-w-2xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-agri-500/10 border border-agri-500/20 rounded-full text-agri-300 text-xs font-semibold">
            <Sprout className="w-3.5 h-3.5 text-agri-400" />
            <span>24/7 Digital Farming Assistance</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Still Have Questions or Need Custom Advice?
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
            Our AI Assistant is trained on agricultural extension data to answer crop health, soil, and weather queries instantaneously.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/assistant"
              className="btn-primary py-3 px-6 text-xs sm:text-sm font-bold w-full sm:w-auto"
            >
              <Cpu className="w-4 h-4 text-white" />
              <span>Ask AgriQura AI</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/expert"
              className="btn-secondary py-3 px-5 text-xs sm:text-sm font-semibold bg-slate-950 border-slate-700 w-full sm:w-auto"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>Connect with Agronomist</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
