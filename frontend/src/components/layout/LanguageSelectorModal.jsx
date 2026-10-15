import React from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../../i18n/i18n';
import { Globe, Check, X, Sparkles } from 'lucide-react';

export default function LanguageSelectorModal({ isOpen, onClose }) {
  const { i18n, t } = useTranslation();

  if (!isOpen) return null;

  const currentLang = i18n.language || 'en';

  const handleSelectLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('i18nextLng', code);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in-down">
      <div
        className="bg-slate-900 border border-slate-700 shadow-2xl rounded-3xl max-w-xl w-full p-6 sm:p-8 relative overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="language-modal-title"
      >
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-agri-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-agri-500/20 border border-agri-500/30 flex items-center justify-center text-agri-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 id="language-modal-title" className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {t('nav.selectLanguage', 'Select Your Language')}
              </h2>
              <p className="text-xs text-slate-400">
                11 Regional Indian Languages Supported
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            aria-label="Close language selector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Languages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 py-6 max-h-[60vh] overflow-y-auto pr-1">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = currentLang === lang.code || currentLang.startsWith(lang.code);

            return (
              <button
                key={lang.code}
                onClick={() => handleSelectLanguage(lang.code)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all duration-200 group ${
                  isSelected
                    ? 'bg-agri-600/20 border-agri-500/60 shadow-md shadow-agri-950/40 ring-1 ring-agri-500/30'
                    : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-gradient-to-br from-agri-500 to-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                    }`}
                  >
                    {lang.badge}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate group-hover:text-agri-300 transition-colors">
                      {lang.native}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {lang.name} • <span className="text-slate-500">{lang.region}</span>
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-agri-500 text-white flex items-center justify-center shrink-0 ml-2">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-agri-400" />
            <span>Instant UI & Voice Translation</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
