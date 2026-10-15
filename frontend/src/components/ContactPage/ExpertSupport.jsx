import React from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, ShieldAlert, ArrowRight } from 'lucide-react';

export default function ExpertSupport() {
  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
          <UserCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">Need Expert Human Assistance?</h3>
          <p className="text-xs text-slate-400">Connect with certified KVK agronomists and agricultural extension officers.</p>
        </div>
      </div>

      {/* Strict non-replacement disclaimer */}
      <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl text-xs text-amber-300 flex items-start gap-2 leading-relaxed">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <span>
          <strong>Advisory Notice:</strong> AI assistance is informational and does not replace qualified in-person agricultural advice from local Krishi Vigyan Kendra (KVK) officers.
        </span>
      </div>

      <Link
        to="/expert"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 rounded-xl text-xs font-bold transition-all"
      >
        <span>Request Expert Support</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
