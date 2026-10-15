import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sprout, ShieldCheck, Mail, Globe, ExternalLink } from 'lucide-react';
import agrilogo from "../../assets/AgriQura_logo.png";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="relative z-20 bg-gradient-to-b from-slate-950 via-slate-900/90 to-black border-t border-slate-800/80 text-slate-400 text-sm py-12 pb-24 md:pb-12 shadow-2xl backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <img src={agrilogo} alt="AgriQura Logo" className="w-11 h-11 rounded-xl shadow-lg border border-slate-700/60" />
            <div>
              <span className="text-xl font-extrabold text-white tracking-tight">AgriQura</span>
              <p className="text-[10px] text-agri-400 font-bold uppercase tracking-wider">Farmer AI Platform</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t('footer.platformDesc', 'AI-based farmer query support and personalized advisory system built for Smart India Hackathon.')}
          </p>

          {/* Developer & Owner Badge */}
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-agri-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-agri-400 animate-pulse" />
                Developer & Owner
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">Lead Architect</span>
            </div>
            <div className="flex items-center justify-between pt-0.5">
              <span className="text-xs font-bold text-white tracking-wide">GVignesh</span>
              <a
                href="https://github.com/GVignesh777"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-agri-400 hover:text-agri-300 transition-colors"
              >
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300 pt-0.5">
            <Mail className="w-4 h-4 text-agri-400" />
            <span className="font-medium">agriqura@gmail.com</span>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm tracking-wide mb-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-agri-400"></span>
            {t('footer.coreModules', 'Core Modules')}
          </h4>
          <ul className="space-y-2 text-xs">
            <li><a href="/assistant" className="hover:text-agri-400 transition-colors">{t('nav.assistant', 'AI Assistant')} (Voice + Text AI)</a></li>
            <li><a href="/disease" className="hover:text-agri-400 transition-colors">{t('nav.disease', 'Crop Disease Screening')}</a></li>
            <li><a href="/weather" className="hover:text-agri-400 transition-colors">{t('nav.weather', 'Weather Intelligence')}</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm tracking-wide mb-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            {t('footer.farmerServices', 'Farmer Services')}
          </h4>
          <ul className="space-y-2 text-xs">
            <li><a href="/market" className="hover:text-emerald-400 transition-colors">{t('nav.market', 'Live Mandi Prices (Agmarknet)')}</a></li>
            <li><a href="/schemes" className="hover:text-emerald-400 transition-colors">{t('nav.schemes', 'Government Schemes')}</a></li>
            <li><a href="/help-desk" className="hover:text-emerald-400 transition-colors">{t('nav.helpDesk', 'Help-Line Desk')}</a></li>
            <li><a href="/contact" className="hover:text-emerald-400 transition-colors">{t('nav.contact', 'Contact Support')}</a></li>
            <li><a href="/faq" className="hover:text-emerald-400 transition-colors">{t('nav.faq', 'Frequently Asked Questions')}</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm tracking-wide mb-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            {t('footer.safetyTitle', 'SIH & Advisory Safety')}
          </h4>
          <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-inner space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <ShieldCheck className="w-4 h-4" />
              <span>AI Screening Safety</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {t('footer.safetyDesc', 'AgriQura AI provides advisory screening. Critical crop issues should always be verified with certified local KVK officers.')}
            </p>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <p>
          © 2026 AgriQura. Developed & Owned by{' '}
          <a
            href="https://github.com/GVignesh777"
            target="_blank"
            rel="noopener noreferrer"
            className="text-agri-400 font-bold hover:underline"
          >
            GVignesh
          </a>
          . Smart India Hackathon Production Build.
        </p>
        <div className="flex gap-4">
          <a
            href="https://github.com/GVignesh777"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-agri-300 transition-colors font-medium"
          >
            Developer: GVignesh
          </a>
          <span>•</span>
          <a href="/privacy" className="hover:text-slate-300 transition-colors">{t('footer.privacy', 'Privacy & Consent')}</a>
          <span>•</span>
          <a href="/faq" className="hover:text-slate-300 transition-colors">{t('footer.faq', 'FAQ Support')}</a>
        </div>
      </div>
    </footer>
  );
}
