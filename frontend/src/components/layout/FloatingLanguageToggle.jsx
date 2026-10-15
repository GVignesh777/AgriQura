import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../../i18n/i18n';
import { Globe } from 'lucide-react';
import LanguageSelectorModal from './LanguageSelectorModal';

export default function FloatingLanguageToggle() {
  const [modalOpen, setModalOpen] = useState(false);
  const { i18n } = useTranslation();

  const currentLangCode = i18n.language || 'en';
  const currentLang =
    SUPPORTED_LANGUAGES.find(
      (l) => l.code === currentLangCode || currentLangCode.startsWith(l.code)
    ) || SUPPORTED_LANGUAGES[0];

  return (
    <>
      {/* Floating Language Switcher Button (Bottom Right) */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-900/90 hover:bg-slate-800 border border-agri-500/40 hover:border-agri-400 text-white rounded-2xl shadow-xl shadow-black/50 backdrop-blur-xl transition-all duration-200 hover:scale-105 group"
          title={`Current language: ${currentLang.name} (${currentLang.native}). Click to change language.`}
          aria-label="Change Language"
        >
          <div className="w-6 h-6 rounded-lg bg-agri-500/20 border border-agri-500/40 flex items-center justify-center text-agri-400 group-hover:bg-agri-500/30 transition-colors">
            <Globe className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold leading-none">
              Language
            </span>
            <span className="text-xs font-bold text-agri-300 leading-tight">
              {currentLang.native}
            </span>
          </div>
        </button>
      </div>

      {/* Language Selection Modal */}
      <LanguageSelectorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
