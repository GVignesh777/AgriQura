import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles, Filter } from 'lucide-react';

export default function PopularQuestions({
  faqs = [],
  activeCategory,
  onCategoryChange,
}) {
  const [openIds, setOpenIds] = useState(['faq-1']); // Open first FAQ by default

  const toggleAccordion = (id) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const categoriesFilter = [
    { key: 'all', label: 'All Topics' },
    { key: 'crop-disease', label: 'Crop & Disease' },
    { key: 'market-prices', label: 'Market Prices' },
    { key: 'soil-fertilizer', label: 'Fertilizer & Soil' },
    { key: 'irrigation-water', label: 'Irrigation' },
    { key: 'voice-assistant', label: 'Voice Assistant' },
    { key: 'account-app', label: 'Account & Settings' },
  ];

  const filteredFaqs = activeCategory && activeCategory !== 'all'
    ? faqs.filter((f) => f.category === activeCategory)
    : faqs;

  return (
    <section id="faqs" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-agri-500/10 border border-agri-500/25 rounded-full text-agri-300 text-xs font-bold tracking-wide">
          <HelpCircle className="w-3.5 h-3.5 text-agri-400" />
          <span>Frequently Asked Agricultural Questions</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Common Questions & Practical Solutions
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Direct, actionable answers to common farmer queries about crop management, mandi rates, and AI advisory features.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        {categoriesFilter.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onCategoryChange?.(tab.key)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              (activeCategory || 'all') === tab.key
                ? 'bg-agri-600 text-white shadow-md shadow-agri-950/40'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => {
            const isOpen = openIds.includes(faq.id);
            const contentId = `faq-content-${faq.id}`;
            const headerId = `faq-header-${faq.id}`;

            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-slate-900/90 border-agri-500/40 shadow-lg shadow-agri-950/30'
                    : 'bg-slate-900/50 hover:bg-slate-900/80 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <h3>
                  <button
                    id={headerId}
                    onClick={() => toggleAccordion(faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-agri-500"
                  >
                    <span className="text-sm sm:text-base font-semibold text-slate-100 pr-4">
                      {faq.question}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? 'bg-agri-500/20 text-agri-400 rotate-180'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>
                </h3>

                {isOpen && (
                  <div
                    id={contentId}
                    role="region"
                    aria-labelledby={headerId}
                    className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 space-y-3 animate-fade-in-down"
                  >
                    <p>{faq.answer}</p>
                    {faq.tags && faq.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {faq.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/60 font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-2xl">
            <p className="text-sm text-slate-400">No questions found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}
