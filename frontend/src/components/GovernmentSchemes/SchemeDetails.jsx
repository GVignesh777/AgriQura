import React, { useState } from 'react';
import {
  X,
  Landmark,
  Building,
  CheckCircle2,
  FileText,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Bookmark,
  Share2,
  ArrowRight,
  Info,
  ListOrdered
} from 'lucide-react';

export default function SchemeDetails({
  scheme,
  isOpen,
  onClose,
  onOpenAIExplainer,
  onSaveScheme,
  isSaved = false
}) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !scheme) return null;

  const isState = scheme.governmentLevel === 'State';

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'benefits', label: 'Benefits & Financials' },
    { id: 'eligibility', label: 'Eligibility Criteria' },
    { id: 'documents', label: 'Required Documents' },
    { id: 'process', label: 'How to Apply' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col animate-scale-up">

        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800 flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                  isState
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                }`}
              >
                {isState ? `${scheme.state} State Scheme` : 'Central Sector Scheme'}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded-md">
                {scheme.category}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              {scheme.name}
            </h2>

            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{scheme.ministry || scheme.department}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Bookmark button */}
            {onSaveScheme && (
              <button
                onClick={() => onSaveScheme(scheme)}
                className={`p-2 rounded-xl border transition-colors ${
                  isSaved
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
                title={isSaved ? 'Scheme Saved' : 'Save Scheme'}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400' : ''}`} />
              </button>
            )}

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 bg-slate-900 border-b border-slate-800 overflow-x-auto shrink-0 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-amber-400 text-amber-300 bg-amber-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">

          {/* ──── OVERVIEW TAB ──── */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">About This Scheme</h4>
                <p className="text-sm text-slate-200 leading-relaxed">{scheme.description}</p>
              </div>

              {/* Key Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-850/80 border border-slate-800 rounded-2xl space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Target Crops</p>
                  <p className="text-xs font-semibold text-white">
                    {scheme.crops && scheme.crops.length > 0 ? scheme.crops.join(', ') : 'All Agricultural Crops'}
                  </p>
                </div>

                <div className="p-4 bg-slate-850/80 border border-slate-800 rounded-2xl space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Eligible Farmer Types</p>
                  <p className="text-xs font-semibold text-white">
                    {scheme.farmerTypes && scheme.farmerTypes.length > 0 ? scheme.farmerTypes.join(', ') : 'All Farmers'}
                  </p>
                </div>

                <div className="p-4 bg-slate-850/80 border border-slate-800 rounded-2xl space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Official Portal</p>
                  <p className="text-xs font-semibold text-amber-400 truncate">{scheme.sourcePortal || 'myScheme.gov.in'}</p>
                </div>

                <div className="p-4 bg-slate-850/80 border border-slate-800 rounded-2xl space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Application Cycle</p>
                  <p className="text-xs font-semibold text-white">
                    {scheme.importantDates?.applicationDeadline || 'Open Throughout the Year'}
                  </p>
                </div>
              </div>

              {/* Source Attribution Notice */}
              <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-400 leading-relaxed flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-agri-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Official Authority Source:</strong> {scheme.officialSource}. AgriQura displays verified information from public gazettes and government portals. Final approval rests with the respective department.
                </span>
              </div>
            </div>
          )}

          {/* ──── BENEFITS TAB ──── */}
          {activeTab === 'benefits' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl space-y-1">
                <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Primary Assistance Amount</p>
                <p className="text-xl font-extrabold text-white">{scheme.benefits?.amountText || 'Government Subsidy'}</p>
                <p className="text-xs text-slate-300">{scheme.benefits?.summary}</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-agri-400" /> Benefit Breakdown
                </h4>
                <ul className="space-y-2">
                  {scheme.benefits?.details && scheme.benefits.details.map((detail, idx) => (
                    <li key={idx} className="p-3 bg-slate-850 border border-slate-800 rounded-xl text-xs text-slate-200 flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-agri-400 mt-1.5 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* ──── ELIGIBILITY TAB ──── */}
          {activeTab === 'eligibility' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <span>
                  <strong>Advisory Disclaimer:</strong> AgriQura highlights official eligibility criteria. Actual qualification is verified by government field officers during document scrutiny.
                </span>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Official Criteria Checklist</h4>
                <ul className="space-y-2.5">
                  {scheme.eligibility?.criteria && scheme.eligibility.criteria.map((crit, idx) => (
                    <li key={idx} className="p-3 bg-slate-850 border border-slate-800 rounded-xl text-xs text-slate-200 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{crit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* ──── REQUIRED DOCUMENTS TAB ──── */}
          {activeTab === 'documents' && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-xs text-slate-300">
                Keep the following official documents ready before initiating your application:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {scheme.requiredDocuments && scheme.requiredDocuments.map((doc, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-850 border border-slate-800 rounded-xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-200">{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ──── HOW TO APPLY TAB ──── */}
          {activeTab === 'process' && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-3">
                {scheme.applicationProcess && scheme.applicationProcess.map((step, idx) => (
                  <div key={idx} className="p-4 bg-slate-850 border border-slate-800 rounded-2xl flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0">
                      {step.stepNumber || idx + 1}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-white">{step.title}</p>
                      <p className="text-xs text-slate-300 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer with Actions */}
        <div className="p-6 bg-slate-900/90 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          
          {/* AI Explainer Trigger */}
          <button
            onClick={() => onOpenAIExplainer(scheme)}
            className="w-full sm:w-auto px-4 py-2.5 bg-agri-500/15 hover:bg-agri-500/25 border border-agri-500/30 text-agri-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-agri-400" />
            <span>Explain with AgriQura AI (Groq Llama 3)</span>
          </button>

          {/* Official Application Portal Link */}
          {scheme.applicationUrl ? (
            <a
              href={scheme.applicationUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 transition-all"
            >
              <span>Apply via Official Portal</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <span className="text-xs text-slate-400 font-medium">
              Offline Registration at Block Agriculture / CSC Office
            </span>
          )}

        </div>

      </div>
    </div>
  );
}
