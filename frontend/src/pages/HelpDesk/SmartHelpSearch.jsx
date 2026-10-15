import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, ArrowRight, BookOpen, Bug, Sparkles, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SmartHelpSearch({
  faqs = [],
  categories = [],
  onSelectFaq,
  onSelectCategory,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Debounced search filtering
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      setSelectedIndex(-1);
      return;
    }

    const timer = setTimeout(() => {
      const q = searchTerm.toLowerCase().trim();

      const matchedCategories = categories
        .filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q)
        )
        .slice(0, 2)
        .map((c) => ({ type: 'category', item: c }));

      const matchedFaqs = faqs
        .filter(
          (f) =>
            f.question.toLowerCase().includes(q) ||
            f.answer.toLowerCase().includes(q) ||
            f.tags?.some((t) => t.toLowerCase().includes(q))
        )
        .slice(0, 4)
        .map((f) => ({ type: 'faq', item: f }));

      const combined = [...matchedCategories, ...matchedFaqs];
      setSuggestions(combined);
      setIsOpen(combined.length > 0);
      setSelectedIndex(-1);
    }, 150);

    return () => clearTimeout(timer);
  }, [searchTerm, categories, faqs]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSelect(suggestions[selectedIndex]);
      } else if (suggestions.length > 0) {
        handleSelect(suggestions[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelect = (match) => {
    if (match.type === 'category') {
      onSelectCategory?.(match.item.slug);
      setSearchTerm(match.item.name);
    } else if (match.type === 'faq') {
      onSelectFaq?.(match.item);
      setSearchTerm(match.item.question);
    }
    setIsOpen(false);
  };

  const handleVoiceClick = () => {
    navigate('/assistant');
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  return (
    <div ref={searchRef} className="relative max-w-2xl mx-auto w-full">
      {/* Search Input Container */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-agri-400 transition-colors">
          <Search className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search farming problems, crop diseases, market prices..."
          className="w-full pl-12 pr-24 py-4 bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 focus:border-agri-500/80 rounded-2xl text-slate-100 placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:ring-4 focus:ring-agri-500/15 shadow-xl backdrop-blur-md transition-all"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls="help-search-suggestions"
        />

        {/* Right Actions: Clear & Voice */}
        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1.5">
          {searchTerm && (
            <button
              onClick={clearSearch}
              type="button"
              className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleVoiceClick}
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 bg-agri-600/20 hover:bg-agri-600/30 border border-agri-500/30 text-agri-300 hover:text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
            title="Ask with Voice Assistant"
          >
            <Mic className="w-3.5 h-3.5 text-agri-400 animate-pulse" />
            <span className="hidden sm:inline">Voice</span>
          </button>
        </div>
      </div>

      {/* Autocomplete Suggestions Dropdown */}
      {isOpen && (
        <div
          id="help-search-suggestions"
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+8px)] bg-slate-900/95 border border-slate-700/80 shadow-2xl rounded-2xl p-2 z-50 backdrop-blur-xl animate-fade-in-down max-h-96 overflow-y-auto"
        >
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-800">
            <span>Instant Suggestions</span>
            <span className="text-slate-400">Use ↑↓ keys to navigate</span>
          </div>

          <div className="space-y-1 mt-1">
            {suggestions.map((match, idx) => {
              const isSelected = selectedIndex === idx;

              if (match.type === 'category') {
                return (
                  <button
                    key={`cat-${match.item.id}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(match)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center gap-3 transition-colors ${
                      isSelected
                        ? 'bg-agri-600/20 text-white border border-agri-500/30'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <Bug className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">{match.item.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{match.item.description}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold uppercase">
                      Category
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={`faq-${match.item.id}`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(match)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center gap-3 transition-colors ${
                    isSelected
                      ? 'bg-agri-600/20 text-white border border-agri-500/30'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center shrink-0">
                    <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-200 truncate">{match.item.question}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{match.item.answer}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                </button>
              );
            })}
          </div>

          <div className="p-2 border-t border-slate-800/80 mt-1 flex items-center justify-between text-[11px] text-slate-400">
            <span>Can't find your topic?</span>
            <button
              onClick={() => navigate('/assistant')}
              className="text-agri-400 hover:text-agri-300 font-semibold flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              Ask AI Assistant
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
