import React from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Headset,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Sprout
} from 'lucide-react';

export default function ContactHero({ onScrollToForm }) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800/80 p-6 sm:p-10 shadow-2xl">
      {/* Background Soft Emerald & Agri Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-agri-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="relative z-10 max-w-3xl space-y-5">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Link to="/" className="hover:text-agri-400 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-agri-300">Contact & Support</span>
        </nav>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-agri-500/15 border border-agri-500/30 rounded-full text-xs font-bold text-agri-400">
          <Sprout className="w-3.5 h-3.5" />
          <span>Farmer First Communication Center</span>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-agri-400 via-emerald-300 to-amber-300">Grow Together</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Whether you're a farmer looking for assistance, a partner interested in AgriQura, or someone with feedback, we'd love to hear from you.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={onScrollToForm}
            className="px-6 py-3 bg-gradient-to-r from-agri-600 to-emerald-600 hover:from-agri-500 hover:to-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-agri-950/60 hover:scale-[1.02] transition-all flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Send a Message</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <Link
            to="/help-desk"
            className="px-5 py-3 bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-semibold text-sm rounded-xl transition-colors flex items-center gap-2"
          >
            <Headset className="w-4 h-4 text-agri-400" />
            <span>Visit Help Desk</span>
          </Link>
        </div>

        {/* Trust Indicator Line */}
        <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-agri-400 shrink-0" />
          <span>Direct support for farmers, agricultural students, institutions & research partners.</span>
        </div>

      </div>
    </section>
  );
}
