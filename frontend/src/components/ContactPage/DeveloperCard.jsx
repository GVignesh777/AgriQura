import React from 'react';
import { Code, ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';
import contactConfig from '../../config/contactConfig';

export default function DeveloperCard() {
  return (
    <div className="p-6 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 hover:border-agri-500/40 transition-all rounded-3xl space-y-4 shadow-xl">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-agri-500 via-emerald-500 to-teal-400 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-agri-500/20 shrink-0">
          GV
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">GVignesh</h3>
            <span className="px-2 py-0.5 rounded-full bg-agri-500/15 border border-agri-500/30 text-agri-300 text-[10px] font-bold">
              Owner
            </span>
          </div>
          <p className="text-xs text-slate-400">Lead Developer & System Architect</p>
        </div>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">
        AgriQura AI is created and owned by <strong>GVignesh</strong> for the Smart India Hackathon. Designed to bridge the technological gap for Indian farmers through accessible multilingual AI.
      </p>

      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">Official Profile:</span>
        <a
          href={contactConfig.socialLinks.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-agri-300 hover:text-white border border-slate-700 text-xs font-semibold transition-all"
        >
          <span>github.com/GVignesh777</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
