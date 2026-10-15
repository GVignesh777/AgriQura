import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Globe,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Volume2
} from 'lucide-react';
import schemesService from '../../services/schemes.service';

const REGIONAL_LANGUAGES = [
  { code: 'English', label: 'English' },
  { code: 'Telugu', label: 'తెలుగు (Telugu)' },
  { code: 'Hindi', label: 'हिन्दी (Hindi)' },
  { code: 'Tamil', label: 'தமிழ் (Tamil)' },
  { code: 'Kannada', label: 'ಕನ್ನಡ (Kannada)' },
  { code: 'Marathi', label: 'मराठी (Marathi)' },
  { code: 'Bengali', label: 'বাংলা (Bengali)' },
  { code: 'Punjabi', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'Gujarati', label: 'ગુજરાતી (Gujarati)' }
];

export default function AskAgriQuraSchemeExplainer({
  scheme,
  isOpen,
  onClose
}) {
  const [language, setLanguage] = useState('English');
  const [query, setQuery] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !scheme) return null;

  const handleAskAI = async (customPrompt) => {
    const promptToSend = customPrompt || query;
    if (!promptToSend.trim() && !customPrompt) return;

    setIsLoading(true);
    try {
      const res = await schemesService.explainSchemeAI({
        schemeId: scheme.schemeId || scheme.id,
        question: promptToSend,
        language
      });
      setExplanation(res.explanation || 'No response received.');
    } catch (err) {
      console.error(err);
      setExplanation('Unable to contact AgriQura AI. Please check internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    `Am I likely eligible for ${scheme.name}?`,
    `Explain the benefits in simple words in ${language}`,
    `What documents must I prepare before applying?`,
    `Step-by-step instructions to apply for this scheme`
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[85vh] flex flex-col animate-scale-up">

        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-agri-950/40 to-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-agri-500/20 border border-agri-500/30 flex items-center justify-center text-agri-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>AgriQura AI Scheme Explainer</span>
                <span className="text-[10px] px-2 py-0.5 bg-agri-500/15 text-agri-400 border border-agri-500/25 rounded-md font-bold">
                  Groq Llama 3
                </span>
              </h2>
              <p className="text-xs text-slate-400 truncate max-w-md">
                Scoped to: <strong>{scheme.name}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Selection Bar */}
        <div className="px-6 py-2.5 bg-slate-850 border-b border-slate-800 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-400 font-semibold flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-agri-400" />
            <span>Response Language:</span>
          </span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-semibold text-agri-300 focus:outline-none focus:border-agri-500"
          >
            {REGIONAL_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">

          {/* Quick Prompts */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Quick Farmer Questions:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskAI(q)}
                  disabled={isLoading}
                  className="p-2.5 bg-slate-850 hover:bg-slate-800 border border-slate-700/70 hover:border-agri-500/50 rounded-xl text-left text-xs text-slate-200 hover:text-white transition-all flex items-start gap-2"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-agri-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{q}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Response Output */}
          {isLoading && (
            <div className="p-8 text-center space-y-3 bg-slate-850/50 border border-slate-800 rounded-2xl">
              <Loader2 className="w-8 h-8 text-agri-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-300">
                AgriQura AI is analyzing official scheme rules and generating simple instructions in {language}...
              </p>
            </div>
          )}

          {explanation && !isLoading && (
            <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-agri-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Agricultural Advisory ({language})</span>
                </span>
                <span className="text-[10px] text-slate-400">Groq Llama 3 Inference</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line space-y-2">
                {explanation}
              </div>
            </div>
          )}

          {/* Advisory Notice */}
          <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl text-[11px] text-slate-400 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Advisory Trust Principle:</strong> AgriQura AI provides explanatory guidance based on public scheme notifications. Final qualification, land verification, and financial sanctions are determined solely by the competent government authority.
            </span>
          </div>

        </div>

        {/* Input Box */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
            placeholder={`Ask any question about ${scheme.name}...`}
            className="flex-1 px-4 py-2.5 bg-slate-850 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-agri-500"
          />
          <button
            onClick={() => handleAskAI()}
            disabled={isLoading || !query.trim()}
            className="px-4 py-2.5 bg-agri-500 hover:bg-agri-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        </div>

      </div>
    </div>
  );
}
