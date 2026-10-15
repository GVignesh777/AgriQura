import React from 'react';
import {
  Leaf,
  Bug,
  Sprout,
  Droplets,
  Landmark,
  UserCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const iconMap = {
  Leaf,
  Bug,
  Sprout,
  Droplets,
  Landmark,
  UserCheck,
};

export default function HelpCategories({
  categories = [],
  selectedCategory,
  onSelectCategory,
}) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-8">
        <div>
          <div className="flex items-center gap-2 text-agri-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Support Domains</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Agricultural Assistance Topics
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md">
          Select an issue domain below to report a problem or explore practical research guidelines.
        </p>
      </div>

      {/* Grid: 3 columns desktop, 2 columns tablet, 1 column mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => {
          const IconComponent = iconMap[category.icon] || Sprout;
          const isSelected = selectedCategory === category.slug;

          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(isSelected ? null : category.slug)}
              className={`group text-left p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${
                isSelected
                  ? 'bg-agri-950/40 border-agri-500/60 shadow-lg shadow-agri-950/40 ring-2 ring-agri-500/20'
                  : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 hover:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              {/* Header Icon & Badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-agri-500/20 text-agri-400 border border-agri-500/40'
                      : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700/80 group-hover:text-agri-400 border border-slate-700/60'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>

                {category.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-agri-500/15 text-agri-400 border border-agri-500/25 tracking-wide">
                    {category.badge}
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5 mb-4">
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-agri-300 transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {category.description}
                </p>
              </div>

              {/* Footer Row */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-[11px] font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">
                <span>{category.queryCount ? `${category.queryCount.toLocaleString()} issues handled` : 'Support domain'}</span>
                <div className="flex items-center gap-1 text-agri-400 group-hover:translate-x-0.5 transition-transform">
                  <span>Report / Guide</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
