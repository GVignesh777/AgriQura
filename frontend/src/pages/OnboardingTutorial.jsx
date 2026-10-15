import React from 'react';
import { Link } from 'react-router-dom';
import { Mic, Bug, CloudSun, ArrowRight } from 'lucide-react';

export default function OnboardingTutorial() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 text-center">
      <h1 className="text-3xl font-bold text-white">Welcome to AgriQura!</h1>
      <p className="text-xs text-slate-400">A quick 3-step visual guide designed for effortless agricultural support.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        <div className="glass-card p-6 space-y-3">
          <div className="w-10 h-10 bg-agri-500/20 text-agri-400 rounded-xl flex items-center justify-center font-bold">1</div>
          <h3 className="text-base font-bold text-white flex items-center gap-1.5"><Mic className="w-4 h-4 text-emerald-400" /> Speak Your Language</h3>
          <p className="text-xs text-slate-400">Tap the large microphone button to speak in Telugu, Hindi, or English.</p>
        </div>

        <div className="glass-card p-6 space-y-3">
          <div className="w-10 h-10 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center font-bold">2</div>
          <h3 className="text-base font-bold text-white flex items-center gap-1.5"><Bug className="w-4 h-4 text-red-400" /> Snap Crop Leaves</h3>
          <p className="text-xs text-slate-400">Upload leaf photos to get instant AI screening and organic treatment steps.</p>
        </div>

        <div className="glass-card p-6 space-y-3">
          <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center font-bold">3</div>
          <h3 className="text-base font-bold text-white flex items-center gap-1.5"><CloudSun className="w-4 h-4 text-amber-400" /> Check Smart Alerts</h3>
          <p className="text-xs text-slate-400">Receive rainfall warnings before applying expensive fertilizers.</p>
        </div>
      </div>

      <Link to="/dashboard" className="btn-primary py-3.5 px-8 inline-flex text-sm font-semibold">
        Go to Farmer Dashboard <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
