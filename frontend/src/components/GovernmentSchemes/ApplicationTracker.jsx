import React, { useState } from 'react';
import {
  ListChecks,
  CheckCircle2,
  Clock,
  FileText,
  AlertCircle,
  ShieldCheck,
  Edit3,
  Save
} from 'lucide-react';

const TRACKER_STAGES = [
  { id: 'Interested', title: '1. Exploring', desc: 'Saved for review' },
  { id: 'Preparing Documents', title: '2. Documents Ready', desc: 'Aadhaar, Land, Bank passbook' },
  { id: 'Application Started', title: '3. Applying', desc: 'Filling form / CSC visit' },
  { id: 'Submitted', title: '4. Submitted', desc: 'Under scrutiny by dept' },
  { id: 'Approved', title: '5. Approved', desc: 'Benefit released' }
];

export default function ApplicationTracker({
  savedSchemes = [],
  onUpdateStatus,
  onViewDetails
}) {
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [notesText, setNotesText] = useState('');

  const handleSaveNotes = (schemeId) => {
    onUpdateStatus(schemeId, undefined, notesText);
    setEditingNotesId(null);
  };

  return (
    <div className="space-y-6">

      {/* Tracker Banner */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
          <ListChecks className="w-5 h-5" />
          <span>Farmer Application Tracking Pipeline</span>
        </div>
        <p className="text-xs text-slate-300">
          Track your document readiness, CSC submissions, and application stages in one personal dashboard.
        </p>
        <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-[11px] text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-agri-400 shrink-0" />
          <span>
            <strong>Personal Record:</strong> This pipeline records your personal progress. For official government status queries, visit the respective official portal.
          </span>
        </div>
      </div>

      {/* Stages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {TRACKER_STAGES.map((stage) => {
          const matchingSchemes = savedSchemes.filter((s) => s.applicationStatus === stage.id);
          return (
            <div key={stage.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-3 flex flex-col">
              <div className="pb-2 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{stage.title}</h4>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold">
                    {matchingSchemes.length}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">{stage.desc}</p>
              </div>

              <div className="space-y-2 flex-1 overflow-y-auto max-h-80">
                {matchingSchemes.length > 0 ? (
                  matchingSchemes.map((s) => (
                    <div
                      key={s.schemeId}
                      className="p-3 bg-slate-850 border border-slate-700/80 rounded-xl space-y-2 text-xs"
                    >
                      <p className="font-bold text-white leading-tight">{s.schemeName}</p>

                      {/* Status changer */}
                      <select
                        value={s.applicationStatus}
                        onChange={(e) => onUpdateStatus(s.schemeId, e.target.value)}
                        className="w-full text-[10px] bg-slate-900 border border-slate-700 rounded p-1 text-slate-300 focus:outline-none"
                      >
                        {TRACKER_STAGES.map((st) => (
                          <option key={st.id} value={st.id}>
                            Move to: {st.id}
                          </option>
                        ))}
                      </select>

                      {/* Private Notes */}
                      {editingNotesId === s.schemeId ? (
                        <div className="space-y-1">
                          <textarea
                            value={notesText}
                            onChange={(e) => setNotesText(e.target.value)}
                            placeholder="Add reference number or CSC note..."
                            className="w-full text-[11px] bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                            rows={2}
                          />
                          <button
                            onClick={() => handleSaveNotes(s.schemeId)}
                            className="px-2 py-1 bg-amber-500 text-slate-950 rounded text-[10px] font-bold flex items-center gap-1"
                          >
                            <Save className="w-3 h-3" /> Save Note
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="truncate max-w-[110px]">
                            {s.personalNotes || 'No notes added'}
                          </span>
                          <button
                            onClick={() => {
                              setEditingNotesId(s.schemeId);
                              setNotesText(s.personalNotes || '');
                            }}
                            className="text-amber-400 hover:text-amber-300 p-0.5"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-slate-500 text-center py-4">No schemes in this stage</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
