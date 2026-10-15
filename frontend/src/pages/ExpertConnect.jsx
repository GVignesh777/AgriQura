import React, { useState } from 'react';
import api from '../services/api';
import { UserCheck, Send, CheckCircle2 } from 'lucide-react';

export default function ExpertConnect() {
  const [queryTitle, setQueryTitle] = useState('');
  const [queryDescription, setQueryDescription] = useState('');
  const [cropName, setCropName] = useState('Cotton');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/expert', { queryTitle, queryDescription, cropName });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 bg-blue-500/20 text-blue-400 rounded-2xl border border-blue-500/30">
          <UserCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-white">Escalate to Agricultural Expert</h1>
        <p className="text-xs text-slate-400">
          When AI confidence is uncertain, submit your query directly to certified KVK agronomists.
        </p>
      </div>

      {submitted ? (
        <div className="glass-card p-8 text-center space-y-4 border-emerald-500/40">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Query Escalated Successfully!</h2>
          <p className="text-xs text-slate-300">
            An agricultural expert has been notified. They will review your query with full farm context and post a response.
          </p>
          <button onClick={() => setSubmitted(false)} className="btn-secondary text-xs py-2 px-4 mx-auto">
            Submit Another Query
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Query Subject</label>
            <input
              type="text"
              required
              value={queryTitle}
              onChange={(e) => setQueryTitle(e.target.value)}
              placeholder="e.g. Unexplained boll drop in 70-day Cotton crop"
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Affected Crop</label>
            <input
              type="text"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Detailed Observation</label>
            <textarea
              rows={4}
              required
              value={queryDescription}
              onChange={(e) => setQueryDescription(e.target.value)}
              placeholder="Provide details on leaf appearance, field location, soil moisture, and previous sprayings..."
              className="input-field text-sm"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-sm">
            {loading ? 'Submitting...' : 'Submit to Agricultural Expert'}
          </button>
        </form>
      )}

    </div>
  );
}
