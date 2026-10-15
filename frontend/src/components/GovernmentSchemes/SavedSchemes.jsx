import React from 'react';
import {
  Bookmark,
  ExternalLink,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  FileEdit,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const STATUS_COLORS = {
  Interested: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  'Preparing Documents': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  'Application Started': 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  Submitted: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  'Under Review': 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  Approved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Rejected: 'bg-red-500/15 text-red-400 border-red-500/30'
};

export default function SavedSchemes({
  savedSchemes = [],
  onViewDetails,
  onRemoveSaved,
  onUpdateStatus
}) {
  if (savedSchemes.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
          <Bookmark className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white">No Saved Schemes Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Click the bookmark icon on any government scheme card to save it here and track your application progress.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-amber-400" />
          <span>My Saved Schemes ({savedSchemes.length})</span>
        </h3>
        <span className="text-xs text-slate-400">Personal Farmer Workspace</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {savedSchemes.map((item) => (
          <div
            key={item.schemeId}
            className="glass-card p-5 border-slate-800 space-y-3.5 flex flex-col justify-between hover:border-slate-700 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                    STATUS_COLORS[item.applicationStatus] || STATUS_COLORS.Interested
                  }`}
                >
                  {item.applicationStatus}
                </span>

                <button
                  onClick={() => onRemoveSaved(item.schemeId)}
                  className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                {item.schemeName}
              </h4>

              <p className="text-xs text-slate-400">
                Level: <strong>{item.governmentLevel}</strong> | State: <strong>{item.state}</strong>
              </p>
            </div>

            {/* Quick Status Selector */}
            <div className="space-y-1 pt-2 border-t border-slate-800">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Application Status:
              </label>
              <select
                value={item.applicationStatus}
                onChange={(e) => onUpdateStatus(item.schemeId, e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-850 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="Interested">Interested</option>
                <option value="Preparing Documents">Preparing Documents</option>
                <option value="Application Started">Application Started</option>
                <option value="Submitted">Submitted</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => onViewDetails({ schemeId: item.schemeId, name: item.schemeName })}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors text-center"
              >
                View Full Details
              </button>

              {item.applicationUrl && (
                <a
                  href={item.applicationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition-colors"
                  title="Open Official Portal"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
