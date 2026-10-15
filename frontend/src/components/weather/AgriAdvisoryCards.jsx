import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ShieldAlert,
  Sprout,
  Droplets,
  Wind,
  Tractor,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Bot,
  ArrowRight,
  Send,
  Loader2,
  X,
} from 'lucide-react';
import { weatherService } from '../../services/weatherService';

export default function AgriAdvisoryCards({ weather, currentCrop = 'Cotton' }) {
  const { t, i18n } = useTranslation();
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');

  if (!weather) return null;

  const risks = weather.risks || [];
  const activities = weather.activities || [];

  const handleAskAI = async (e) => {
    e?.preventDefault();
    if (aiLoading) return;
    setAiLoading(true);

    try {
      const response = await weatherService.getAIAdvisory({
        weatherData: weather,
        crop: currentCrop,
        question: aiQuestion || `What are the best farm management practices for my ${currentCrop} crop today with this weather?`,
        language: i18n.language || 'en',
      });
      setAiResponse(response);
    } catch (err) {
      setAiResponse('Unable to connect to AI advisor at this moment. Please check your network and try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const getRiskBadge = (level) => {
    switch (level) {
      case 'High':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
            <XCircle className="w-3 h-3" /> High Risk
          </span>
        );
      case 'Moderate':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Moderate
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Low Risk
          </span>
        );
    }
  };

  const getActivityStatusBadge = (rating) => {
    switch (rating) {
      case 'Favorable':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            Favorable
          </span>
        );
      case 'Unfavorable':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-xl bg-red-500/20 text-red-300 border border-red-500/40">
            Unfavorable
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
            Exercise Caution
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ───── 1. Real-Data Farming Risk Indicators ───── */}
      <div className="glass-card p-5 sm:p-6 space-y-4 border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">
              Agronomic Risk Indicators (Derived from Real Telemetry)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">AgriQura Decision Engine</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {risks.map((risk, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-950/70 border border-slate-800/90 rounded-2xl space-y-2 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{risk.label}</span>
                {getRiskBadge(risk.level)}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {risk.reason}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ───── 2. Farming Activity Decision Recommendations ───── */}
      <div className="glass-card p-5 sm:p-6 space-y-4 border-agri-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-agri-400" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Farming Activity Recommendations
              </h3>
              <p className="text-xs text-slate-400">
                Actionable guidelines for your field operations today
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsAiModalOpen(true);
              if (!aiResponse) handleAskAI();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-agri-600 to-emerald-600 hover:from-agri-500 hover:to-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-agri-950/50 transition-all group"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover:scale-110 transition-transform" />
            <span>Consult AI Meteorologist</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map((act, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-3 hover:border-slate-700 transition-all group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white tracking-wide">{act.title}</span>
                  {getActivityStatusBadge(act.rating)}
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-lg bg-slate-950 text-agri-400 text-[11px] font-bold">
                  Status: {act.status}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {act.reason}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ───── 3. Groq AI Agricultural Interpretation Modal ───── */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-agri-500/40 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-agri-500/20 border border-agri-500/30 flex items-center justify-center text-agri-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    AgriQura AI Weather Agronomist
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Groq Llama-3 crop-aware weather interpretation
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAiModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Response Area */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 min-h-[140px] max-h-[300px] overflow-y-auto text-xs text-slate-200 leading-relaxed space-y-2">
              {aiLoading ? (
                <div className="flex flex-col items-center justify-center h-32 text-agri-400 space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-xs">Analyzing real telemetry for {currentCrop}...</span>
                </div>
              ) : aiResponse ? (
                <div className="whitespace-pre-wrap">{aiResponse}</div>
              ) : (
                <p className="text-slate-500 text-center py-6">
                  Ask any question about spraying, irrigation, or pest protection with today's weather.
                </p>
              )}
            </div>

            {/* Question Input */}
            <form onSubmit={handleAskAI} className="flex gap-2">
              <input
                type="text"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                placeholder={`Ask about spraying, irrigation for ${currentCrop}...`}
                className="input-field text-xs sm:text-sm py-2.5 rounded-xl bg-slate-950"
              />
              <button
                type="submit"
                disabled={aiLoading}
                className="btn-primary px-4 py-2 text-xs font-bold rounded-xl shrink-0 flex items-center gap-1.5"
              >
                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Ask</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
