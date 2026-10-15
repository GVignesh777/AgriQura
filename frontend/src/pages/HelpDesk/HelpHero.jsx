import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ChevronRight,
  Home,
  Headphones,
  Sparkles,
  Globe,
  AlertTriangle,
  PhoneCall,
  BookOpen,
  MapPin,
  Sprout,
  ChevronDown,
} from 'lucide-react';
import LanguageSelectorModal from '../../components/layout/LanguageSelectorModal';
import { SUPPORTED_LANGUAGES } from '../../i18n/i18n';

export default function HelpHero() {
  const { i18n, t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);

  const currentLangCode = i18n.language || 'en';
  const currentLang =
    SUPPORTED_LANGUAGES.find(
      (l) => l.code === currentLangCode || currentLangCode.startsWith(l.code)
    ) || SUPPORTED_LANGUAGES[0];

  const quickLinks = [
    { label: t('helpDesk.reportProblem', 'Report a Problem'), href: '#report-problem', icon: AlertTriangle, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
    { label: t('helpDesk.talkToExpert', 'Talk to Expert'), href: '#expert-assistance', icon: PhoneCall, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
    { label: t('helpDesk.knowledgeGuides', 'Knowledge Guides'), href: '#knowledge-center', icon: BookOpen, color: 'text-sky-400 border-sky-500/30 bg-sky-500/10' },
    { label: t('helpDesk.nearbyCenters', 'Nearby Centers'), href: '#nearby-services', icon: MapPin, color: 'text-teal-400 border-teal-500/30 bg-teal-500/10' },
  ];

  return (
    <>
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800/80 pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Background Subtle Accent Motifs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden">
          <div className="absolute -top-32 left-1/4 w-96 h-96 bg-agri-500/10 rounded-full blur-3xl" />
          <div className="absolute top-12 right-1/4 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl" />
          <div className="absolute top-6 left-8 opacity-10 text-agri-400">
            <Sprout className="w-28 h-28" />
          </div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Top Bar: Breadcrumb + Language Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-xl backdrop-blur-sm">
              <Link to="/" className="flex items-center gap-1 hover:text-white transition-colors">
                <Home className="w-3.5 h-3.5 text-agri-400" />
                <span>{t('nav.home', 'Home')}</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-agri-400 font-semibold flex items-center gap-1">
                <Headphones className="w-3.5 h-3.5" />
                {t('nav.helpDesk', 'Help-Line Desk')}
              </span>
            </nav>

            {/* Language Selector Button */}
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-agri-500/50 px-3.5 py-2 rounded-xl backdrop-blur-sm text-xs font-semibold text-white transition-all shadow-sm group"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-agri-400 group-hover:rotate-45 transition-transform" />
              <span className="text-slate-400">{t('nav.language', 'Language')}:</span>
              <span className="text-agri-300 font-bold">{currentLang.native}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          {/* Hero Title & Subtitle */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-agri-500/10 border border-agri-500/25 rounded-full text-agri-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-agri-400" />
              <span>{t('helpDesk.title', 'Digital Agricultural Support Center')}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {t('helpDesk.heroHeading', 'How can AgriQura help you today?')}
            </h1>

            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {t('helpDesk.heroSubtitle', 'Report field issues, connect with certified agricultural officers, access research guides, and find nearby Krishi Vigyan Kendras.')}
            </p>
          </div>

          {/* Quick Jump Action Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {quickLinks.map((item) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all hover:scale-105 shadow-sm ${item.color}`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Language Selector Modal */}
      <LanguageSelectorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
