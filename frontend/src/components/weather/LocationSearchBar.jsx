import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, Navigation, Loader2, X } from 'lucide-react';
import { weatherService } from '../../services/weatherService';
import { locationService } from '../../services/locationService';

export default function LocationSearchBar({ onSelectLocation, onUseGps, isGpsLoading }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const matches = await weatherService.searchLocations(query);
        setResults(matches);
        setIsOpen(true);
      } catch (err) {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    const loc = {
      name: item.name,
      district: item.district,
      state: item.state,
      country: item.country,
      latitude: item.latitude,
      longitude: item.longitude,
      displayText: item.displayText,
      type: 'manual_search',
    };
    locationService.setActiveLocation(loc);
    onSelectLocation(loc);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative w-full max-w-lg">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (results.length > 0) setIsOpen(true);
            }}
            placeholder="Search village, town, district, or city..."
            className="input-field pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-2xl bg-slate-900/90 border-slate-700/80 focus:border-agri-500 shadow-inner w-full text-white placeholder-slate-500"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={onUseGps}
          disabled={isGpsLoading}
          className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-900/90 hover:bg-slate-800 border border-agri-500/40 text-agri-300 rounded-2xl transition-all text-xs font-semibold shrink-0 shadow-lg shadow-black/40 active:scale-95"
          title="Use GPS Location"
        >
          {isGpsLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-agri-400" />
          ) : (
            <Navigation className="w-4 h-4 text-agri-400" />
          )}
          <span className="hidden sm:inline">Use My Location</span>
        </button>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl max-h-60 overflow-y-auto z-50 p-1.5 text-xs animate-fade-in-down">
          {isLoading ? (
            <div className="flex items-center justify-center p-4 text-slate-400 gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-agri-400" />
              <span>Searching locations...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="w-full flex items-center gap-2.5 p-2.5 hover:bg-slate-800 text-left rounded-xl text-slate-200 transition-colors group"
                >
                  <MapPin className="w-4 h-4 text-agri-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-white truncate text-xs sm:text-sm">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {[item.district, item.state, item.country].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : query.trim().length >= 2 ? (
            <div className="p-3 text-center text-slate-400 text-xs">
              No matching locations found. Try entering a district or major town.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
