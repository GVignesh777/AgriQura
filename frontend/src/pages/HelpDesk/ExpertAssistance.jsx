import React from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, Shield, PhoneCall, ArrowRight, CheckCircle, Info } from 'lucide-react';

export default function ExpertAssistance() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden">
        {/* Ambient background decoration */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Left Column */}
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Certified Agronomist Network</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Need More Help? Connect with an Agricultural Expert
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              For complex crop diseases, unexpected harvest losses, soil amendment plans, or government subsidy disputes, connect with ICAR-recognized agronomists and agricultural extension officers.
            </p>

            {/* Responsible AI Trust Signal */}
            <div className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-2xl flex items-start gap-2.5 text-xs text-slate-400">
              <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p>
                <strong className="text-slate-300">Responsible AI Notice:</strong> AgriQura AI is an assistive digital advisory tool. While trained on verified agricultural research, it does not replace hands-on field inspection by qualified agricultural officers or university agronomists for severe epidemic emergencies.
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            <Link
              to="/expert"
              className="btn-primary py-3.5 px-6 text-sm font-bold shadow-lg shadow-agri-950/50"
            >
              <PhoneCall className="w-4 h-4 text-white" />
              <span>Talk to an Expert</span>
              <ArrowRight className="w-4 h-4 text-white/80" />
            </Link>

            <Link
              to="/expert"
              className="btn-secondary py-3.5 px-5 text-sm font-semibold bg-slate-950/90 border-slate-700/80 hover:border-slate-600 text-slate-200"
            >
              <span>Request Field Assistance</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
