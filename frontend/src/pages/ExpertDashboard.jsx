import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { UserCheck, CheckCircle2 } from 'lucide-react';

export default function ExpertDashboard() {
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [advice, setAdvice] = useState('');

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const res = await api.get('/expert');
      setQueries(res.data.queries || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRespond = async (id) => {
    try {
      await api.put(`/expert/${id}/respond`, { advice });
      setSelectedQuery(null);
      setAdvice('');
      fetchQueries();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <UserCheck className="w-8 h-8 text-blue-400" /> Agronomist Expert Review Dashboard
        </h1>
        <p className="text-xs text-slate-400 mt-1">Review escalated farmer queries, inspect AI analysis, and issue expert recommendations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Escalated Queries</h2>
          {queries.map((q) => (
            <div
              key={q._id}
              onClick={() => setSelectedQuery(q)}
              className={`glass-card p-4 space-y-2 cursor-pointer border transition-colors ${
                selectedQuery?._id === q._id ? 'border-blue-500 bg-blue-950/20' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">{q.cropName} Crop Issue</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${q.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {q.status}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-slate-200">{q.queryTitle}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{q.queryDescription}</p>
            </div>
          ))}
        </div>

        <div>
          {selectedQuery ? (
            <div className="glass-card p-6 space-y-4 border-blue-500/40">
              <h2 className="text-lg font-bold text-white">{selectedQuery.queryTitle}</h2>
              <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                {selectedQuery.queryDescription}
              </p>

              <div>
                <label className="block text-xs font-bold text-white mb-1">Agronomist Recommendation</label>
                <textarea
                  rows={4}
                  value={advice}
                  onChange={(e) => setAdvice(e.target.value)}
                  placeholder="Type expert advice and dosage guidance..."
                  className="input-field text-xs"
                />
              </div>

              <button onClick={() => handleRespond(selectedQuery._id)} className="btn-primary w-full py-2.5 text-xs">
                Submit Response to Farmer
              </button>
            </div>
          ) : (
            <div className="glass-card p-12 text-center text-slate-500 text-xs">
              Select a query on the left to review and respond.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
