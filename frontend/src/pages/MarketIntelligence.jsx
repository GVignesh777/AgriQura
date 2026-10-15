import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Search,
  RefreshCw,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  Cpu,
  CheckCircle2,
  Filter,
  SlidersHorizontal,
  LayoutGrid,
  Table as TableIcon,
  ShieldCheck,
  Info,
  ExternalLink,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Scale,
  Building2,
  Truck,
  Database
} from 'lucide-react';

const QUICK_COMMODITIES = [
  'All',
  'Cotton',
  'Paddy',
  'Chilli',
  'Turmeric',
  'Maize',
  'Onion',
  'Wheat',
  'Soybean',
  'Tomato',
  'Groundnut',
  'Mustard',
  'Garlic',
  'Banana',
  'Potato'
];

export default function MarketIntelligence() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCrop = searchParams.get('crop') || '';

  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(urlCrop);
  const [selectedState, setSelectedState] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [sourceInfo, setSourceInfo] = useState({ isLive: false, source: 'Agmarknet Portal', lastUpdated: '' });
  const [kpiData, setKpiData] = useState({ avgModalPrice: 0, reportingMandis: 0, topCommodity: 'Cotton' });
  const [availableFilters, setAvailableFilters] = useState({ states: ['All'], districts: ['All'], commodities: [] });
  const [selectedModalPrice, setSelectedModalPrice] = useState(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);

  // Synchronize when URL search parameters change
  useEffect(() => {
    const cropFromUrl = searchParams.get('crop');
    if (cropFromUrl !== null && cropFromUrl !== undefined) {
      setSelectedCrop(cropFromUrl);
    }
  }, [searchParams]);

  // Listen for in-page voice filter events
  useEffect(() => {
    const handleVoiceFilter = (e) => {
      if (e.detail?.crop) {
        setSelectedCrop(e.detail.crop);
      }
    };
    window.addEventListener('agriqura-market-filter', handleVoiceFilter);
    return () => window.removeEventListener('agriqura-market-filter', handleVoiceFilter);
  }, []);

  useEffect(() => {
    fetchPrices();
    setCurrentPage(1);
  }, [selectedCrop, selectedState, selectedDistrict, sortBy]);

  const fetchPrices = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const params = new URLSearchParams();
      params.append('limit', '5000'); // Request up to 5000 records from backend
      if (selectedCrop && selectedCrop !== 'All') params.append('crop', selectedCrop);
      if (selectedState && selectedState !== 'All') params.append('state', selectedState);
      if (selectedDistrict && selectedDistrict !== 'All') params.append('district', selectedDistrict);
      if (sortBy !== 'default') params.append('sort', sortBy);

      const res = await api.get(`/market?${params.toString()}`);
      if (res.data.success) {
        setPrices(res.data.prices || []);
        setSourceInfo({
          isLive: res.data.isLive,
          source: res.data.source || 'data.gov.in (Agmarknet Live)',
          lastUpdated: res.data.lastUpdated || new Date().toISOString()
        });
        if (res.data.kpis) {
          setKpiData(res.data.kpis);
        }
        if (res.data.filters) {
          setAvailableFilters(res.data.filters);
        }
      }
    } catch (err) {
      console.error('Error fetching market rates:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const clearFilters = () => {
    setSelectedCrop('');
    setSelectedState('All');
    setSelectedDistrict('All');
    setSortBy('default');
    setCurrentPage(1);
  };

  const totalRecords = prices.length;
  const isAll = itemsPerPage === 'all';
  const numericItemsPerPage = isAll ? totalRecords : Number(itemsPerPage);
  const totalPages = isAll ? 1 : Math.ceil(totalRecords / numericItemsPerPage) || 1;

  const currentDisplayedPrices = useMemo(() => {
    if (isAll) return prices;
    const startIndex = (currentPage - 1) * numericItemsPerPage;
    return prices.slice(startIndex, startIndex + numericItemsPerPage);
  }, [prices, currentPage, numericItemsPerPage, isAll]);

  const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * numericItemsPerPage + 1;
  const endRecord = isAll ? totalRecords : Math.min(currentPage * numericItemsPerPage, totalRecords);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      
      {/* ───── Top Banner / Verified Source Indicator ───── */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-agri-950/80 border-b border-emerald-500/20 px-4 py-2.5 sm:px-8 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-medium">Official Agmarknet Portal:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> data.gov.in Daily Wholesale APMC Price Database
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1 font-semibold text-agri-300">
              <Database className="w-3.5 h-3.5" /> 3000+ Daily Mandi Rates
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <a
              href="https://agmarknet.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-agri-400 hover:text-agri-300 flex items-center gap-1 transition-colors"
            >
              <span>Agmarknet Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* ───── Header Hero Section ───── */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-2 border-b border-slate-800/80">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded-full text-emerald-300 text-xs font-semibold">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pan-India Agricultural Price Intelligence</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Mandi Market Prices & Live APMC Rates
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Real-time daily wholesale prices, modal rates, MSP comparison benchmarks, and arrival volumes across thousands of agricultural market yards nationwide.
            </p>
          </div>

          {/* Quick Refresh & AI Action */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={() => fetchPrices(true)}
              disabled={refreshing}
              className="px-4 py-2.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 rounded-xl text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center gap-2 shadow-sm"
              title="Sync latest prices from data.gov.in"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Syncing...' : 'Refresh All Prices'}</span>
            </button>

            <Link
              to="/assistant?q=Provide a wholesale price forecast and optimal selling window for Cotton and Chilli in Telangana mandis."
              className="px-4 py-2.5 bg-gradient-to-r from-agri-600 to-emerald-600 hover:from-agri-500 hover:to-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-agri-950/50 hover:scale-[1.02]"
            >
              <Cpu className="w-4 h-4" />
              <span>Ask AI Price Forecast</span>
            </Link>
          </div>
        </div>

        {/* ───── Market Summary KPI Cards ───── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-slate-800 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Avg Modal Price</span>
              <Scale className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              ₹{kpiData.avgModalPrice.toLocaleString('en-IN')}{' '}
              <span className="text-xs font-normal text-slate-400">/ qtl</span>
            </div>
            <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3 h-3" /> Across {totalRecords} Reporting Records
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-slate-800 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/20 transition-all pointer-events-none" />
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Available Mandi Prices</span>
              <Building2 className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {totalRecords}{' '}
              <span className="text-xs font-normal text-slate-400">Records Loaded</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Agmarknet Daily Price Feed
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-slate-800 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Top Commodity Focus</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white truncate">
              {kpiData.topCommodity}
            </div>
            <p className="text-[11px] text-amber-400 mt-2 font-medium">
              High trading demand in regional hubs
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-slate-800 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-agri-500/10 rounded-full blur-2xl group-hover:bg-agri-500/20 transition-all pointer-events-none" />
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Data Source Status</span>
              <ShieldCheck className="w-4 h-4 text-agri-400" />
            </div>
            <div className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span>{sourceInfo.source.includes('data.gov') ? 'data.gov.in Live' : 'Agmarknet Certified'}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Synchronized today
            </p>
          </div>

        </div>

        {/* ───── Quick Commodity Pills ───── */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Filter by Commodity:</span>
            {selectedCrop && (
              <button
                onClick={() => setSelectedCrop('')}
                className="text-agri-400 hover:text-agri-300 transition-colors flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Clear Crop Filter
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {QUICK_COMMODITIES.map((c) => {
              const isSelected = (c === 'All' && !selectedCrop) || selectedCrop === c;
              return (
                <button
                  key={c}
                  onClick={() => setSelectedCrop(c === 'All' ? '' : c)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    isSelected
                      ? 'bg-agri-600 text-white shadow-md shadow-agri-950/40 border border-agri-500'
                      : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* ───── Comprehensive Multi-Filter Bar ───── */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                placeholder="Search crop, variety or mandi..."
                className="input-field pl-10 text-xs sm:text-sm bg-slate-950/90 border-slate-700/80 focus:border-emerald-500 rounded-xl"
              />
            </div>

            {/* State Selector */}
            <div className="relative">
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedDistrict('All');
                }}
                className="input-field text-xs sm:text-sm bg-slate-950/90 border-slate-700/80 focus:border-emerald-500 rounded-xl appearance-none pr-8 cursor-pointer"
              >
                <option value="All">All States (Pan-India)</option>
                {availableFilters.states.filter((s) => s !== 'All').map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3.5 pointer-events-none" />
            </div>

            {/* District Selector */}
            <div className="relative">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="input-field text-xs sm:text-sm bg-slate-950/90 border-slate-700/80 focus:border-emerald-500 rounded-xl appearance-none pr-8 cursor-pointer"
              >
                <option value="All">All Districts</option>
                {availableFilters.districts.filter((d) => d !== 'All').map((dst) => (
                  <option key={dst} value={dst}>
                    {dst}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3.5 pointer-events-none" />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field text-xs sm:text-sm bg-slate-950/90 border-slate-700/80 focus:border-emerald-500 rounded-xl appearance-none pr-8 cursor-pointer"
              >
                <option value="default">Sort: Default (Arrivals)</option>
                <option value="price_desc">Highest Modal Price</option>
                <option value="price_asc">Lowest Modal Price</option>
                <option value="gainers">Top Gainers (Upward Trend)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3.5 pointer-events-none" />
            </div>

          </div>

          {/* Active Filter Summary + View & Page Size Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
            <div className="flex items-center gap-2 flex-wrap">
              <span>
                Showing <strong className="text-white">{startRecord} - {endRecord}</strong> of <strong className="text-emerald-400">{totalRecords}</strong> total mandi records
              </span>
              {(selectedCrop || selectedState !== 'All' || selectedDistrict !== 'All' || sortBy !== 'default') && (
                <button
                  onClick={clearFilters}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2 ml-2"
                >
                  Reset all filters
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Items per page selector */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span>Per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(e.target.value === 'all' ? 'all' : Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs font-semibold focus:border-emerald-500 cursor-pointer"
                >
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                  <option value={96}>96</option>
                  <option value="all">All ({totalRecords})</option>
                </select>
              </div>

              {/* View Switcher (Grid vs Table) */}
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'grid'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Grid</span>
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'table'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>Table</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ───── Loading State ───── */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="h-6 bg-slate-800 rounded w-1/2" />
                <div className="h-10 bg-slate-800 rounded w-3/4" />
                <div className="h-16 bg-slate-800 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* ───── Empty State ───── */}
        {!loading && totalRecords === 0 && (
          <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 max-w-lg mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">No Mandi Records Found</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No daily price records matched your search parameters. Try adjusting your crop name, state, or district.
            </p>
            <button
              onClick={clearFilters}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* ───── View Mode 1: Premium Card Grid ───── */}
        {!loading && viewMode === 'grid' && totalRecords > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentDisplayedPrices.map((p, idx) => {
              const spread = p.maxPriceQuintal - p.minPriceQuintal;
              const modalPercentage =
                spread > 0
                  ? Math.min(
                      Math.max(
                        ((p.modalPriceQuintal - p.minPriceQuintal) / spread) * 100,
                        5
                      ),
                      95
                    )
                  : 50;

              return (
                <div
                  key={p.id || idx}
                  className="p-6 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-emerald-950/20 group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Card Header: Crop + Trend Badge */}
                    <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-extrabold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                            {p.cropName}
                          </h3>
                        </div>
                        <span className="text-xs text-slate-400 font-medium line-clamp-1">
                          {p.variety}
                        </span>
                      </div>

                      <div
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 ${
                          p.priceTrend === 'Up'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : p.priceTrend === 'Down'
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {p.priceTrend === 'Up' && <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />}
                        {p.priceTrend === 'Down' && <ArrowDownRight className="w-3.5 h-3.5 stroke-[3]" />}
                        {p.priceTrend === 'Stable' && <Minus className="w-3.5 h-3.5" />}
                        <span>{p.trendPercent || p.priceTrend}</span>
                      </div>
                    </div>

                    {/* Modal Price Highlight */}
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">
                        Modal Wholesale Mandi Rate
                      </span>
                      <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                        ₹{p.modalPriceQuintal.toLocaleString('en-IN')}{' '}
                        <span className="text-xs font-normal text-slate-400">/ quintal</span>
                      </div>
                    </div>

                    {/* Min vs Max Visual Price Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-[11px] font-bold text-slate-400">
                        <span>Min: ₹{p.minPriceQuintal.toLocaleString('en-IN')}</span>
                        <span>Max: ₹{p.maxPriceQuintal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden relative border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                          style={{ width: `${modalPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* MSP Indicator & Daily Arrival */}
                    <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/60">
                      <div className="flex items-center gap-1 text-slate-400">
                        <Scale className="w-3.5 h-3.5 text-agri-400" />
                        <span>MSP: ₹{(p.mspQuintal || p.minPriceQuintal).toLocaleString('en-IN')}</span>
                      </div>
                      {p.arrivalQuantityTons && (
                        <div className="flex items-center gap-1 text-slate-400">
                          <Truck className="w-3.5 h-3.5 text-sky-400" />
                          <span>{p.arrivalQuantityTons} tons arrival</span>
                        </div>
                      )}
                    </div>

                    {/* Location Pin */}
                    <div className="text-xs text-slate-300 font-medium flex items-start gap-1.5 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                      <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate">{p.mandiName}</p>
                        <p className="text-[11px] text-slate-400">{p.district}, {p.state}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedModalPrice(p)}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1"
                    >
                      <Info className="w-3.5 h-3.5 text-slate-400" />
                      <span>Details</span>
                    </button>

                    <Link
                      to={`/assistant?q=Give me a selling strategy and price outlook for ${p.cropName} in ${p.mandiName}, ${p.district}. Today modal price is ₹${p.modalPriceQuintal}/qtl.`}
                      className="px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/40 hover:border-emerald-500 text-emerald-300 hover:text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 group/btn"
                    >
                      <Cpu className="w-3.5 h-3.5" />
                      <span>AI Selling Outlook</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ───── View Mode 2: Interactive Data Table ───── */}
        {!loading && viewMode === 'table' && totalRecords > 0 && (
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Commodity & Variety</th>
                  <th className="py-3.5 px-4">Market Yard (Mandi)</th>
                  <th className="py-3.5 px-4">State & District</th>
                  <th className="py-3.5 px-4 text-right">Min Rate</th>
                  <th className="py-3.5 px-4 text-right">Max Rate</th>
                  <th className="py-3.5 px-4 text-right">Modal Rate</th>
                  <th className="py-3.5 px-4 text-center">Trend</th>
                  <th className="py-3.5 px-4 text-center">AI Advisory</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {currentDisplayedPrices.map((p, idx) => (
                  <tr key={p.id || idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">
                      <div>{p.cropName}</div>
                      <span className="text-[11px] text-slate-400 font-normal">{p.variety}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-medium">
                      {p.mandiName}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-xs">
                      {p.district}, {p.state}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-300">
                      ₹{p.minPriceQuintal.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-300">
                      ₹{p.maxPriceQuintal.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-emerald-400 text-base">
                      ₹{p.modalPriceQuintal.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold ${
                          p.priceTrend === 'Up'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : p.priceTrend === 'Down'
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {p.priceTrend === 'Up' && <ArrowUpRight className="w-3 h-3" />}
                        {p.priceTrend === 'Down' && <ArrowDownRight className="w-3 h-3" />}
                        <span>{p.priceTrend}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Link
                        to={`/assistant?q=Provide a selling strategy and price outlook for ${p.cropName} in ${p.mandiName}.`}
                        className="px-2.5 py-1 bg-agri-600/20 hover:bg-agri-600 text-agri-300 hover:text-white rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1"
                      >
                        <Cpu className="w-3 h-3" />
                        <span>Outlook</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ───── Pagination Controls ───── */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
            <div className="text-slate-400">
              Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong> ({totalRecords} records)
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Dynamic Page Numbers */}
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum = currentPage - 2 + i;
                if (pageNum < 1) pageNum = i + 1;
                if (pageNum > totalPages) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg font-bold text-xs transition-all ${
                      currentPage === pageNum
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
              >
                Last
              </button>
            </div>
          </div>
        )}

        {/* ───── Transparency & Agmarknet Disclaimer ───── */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-2 text-white font-bold">
            <Info className="w-4 h-4 text-emerald-400" />
            <span>About Daily APMC Agmarknet Prices</span>
          </div>
          <p className="leading-relaxed">
            Mandi prices shown are aggregated daily from Agricultural Produce Market Committees (APMCs) across India via data.gov.in and the Directorate of Marketing and Inspection (DMI). Prices reflect modal auction wholesale rates per quintal (100 kg) and may fluctuate during active morning trading sessions.
          </p>
        </div>

      </div>

      {/* ───── Details Modal ───── */}
      {selectedModalPrice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-down">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedModalPrice(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{selectedModalPrice.cropName}</h3>
                <p className="text-xs text-slate-400">{selectedModalPrice.variety}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500">Modal Rate</span>
                <p className="text-lg font-bold text-emerald-400">₹{selectedModalPrice.modalPriceQuintal.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500">Price Trend</span>
                <p className="text-lg font-bold text-white">{selectedModalPrice.priceTrend} ({selectedModalPrice.trendPercent || '0%'})</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500">Min Rate</span>
                <p className="text-sm font-semibold text-slate-200">₹{selectedModalPrice.minPriceQuintal.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500">Max Rate</span>
                <p className="text-sm font-semibold text-slate-200">₹{selectedModalPrice.maxPriceQuintal.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
              <span className="text-slate-500">Market Yard</span>
              <p className="font-bold text-white">{selectedModalPrice.mandiName}</p>
              <p className="text-slate-400">{selectedModalPrice.district}, {selectedModalPrice.state}</p>
              <p className="text-slate-500 text-[11px] pt-1">Arrival Date: {selectedModalPrice.arrivalDate}</p>
            </div>

            <div className="flex gap-3 pt-2">
              <Link
                to={`/assistant?q=Analyze wholesale price trend and tell me when to sell my ${selectedModalPrice.cropName} currently trading at ₹${selectedModalPrice.modalPriceQuintal}/qtl in ${selectedModalPrice.mandiName}.`}
                className="flex-1 py-3 bg-gradient-to-r from-agri-600 to-emerald-600 hover:from-agri-500 hover:to-emerald-500 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 shadow-lg"
              >
                <Cpu className="w-4 h-4" />
                <span>Consult AgriQura AI</span>
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
