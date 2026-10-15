import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Bug,
  TrendingUp,
  CloudSun,
  Landmark,
  ArrowRight
} from 'lucide-react';

export default function FarmerSupportCard() {
  const links = [
    { title: 'AI Disease Screening', desc: 'Scan leaf photos for instant remedies', path: '/disease', icon: Bug, color: 'text-emerald-400' },
    { title: 'Live Mandi Prices', desc: '3,500+ daily APMC mandi market rates', path: '/market', icon: TrendingUp, color: 'text-amber-400' },
    { title: 'Weather Advisory', desc: 'Precipitation, temperature & alerts', path: '/weather', icon: CloudSun, color: 'text-sky-400' },
    { title: 'Govt Schemes Discovery', desc: 'Subsidies, KCC loans & insurance', path: '/schemes', icon: Landmark, color: 'text-purple-400' }
  ];

  return (
    <div className="p-6 sm:p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-5 shadow-xl">
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Sprout className="w-5 h-5 text-agri-400" />
          <span>Need Help With Your Farm? 🌱</span>
        </h3>
        <p className="text-xs text-slate-400">
          AgriQura offers instant agricultural advisory tools across all core farming areas:
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              to={item.path}
              className="p-3.5 bg-slate-850 hover:bg-slate-800 border border-slate-750 hover:border-slate-600 rounded-2xl transition-all flex items-start gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <p className="text-xs font-bold text-white group-hover:text-agri-300 transition-colors flex items-center justify-between">
                  <span>{item.title}</span>
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-agri-400 transition-colors" />
                </p>
                <p className="text-[11px] text-slate-400 leading-tight truncate">{item.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
