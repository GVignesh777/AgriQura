import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import {
  Sprout,
  CloudSun,
  TrendingUp,
  AlertTriangle,
  Cpu,
  Mic,
  Bug,
  ArrowRight,
  Activity,
  Droplets,
  Wind,
  Layers,
  Sparkles,
  MapPin,
  Calendar,
  Compass,
  DollarSign,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import CompactWeatherWidget from '../components/weather/CompactWeatherWidget';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [farms, setFarms] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [weather, setWeather] = useState(null);
  const [marketPrices, setMarketPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [queryInput, setQueryInput] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [farmRes, alertRes, weatherRes, marketRes] = await Promise.all([
        api.get('/farms').catch(() => ({ data: { farms: [] } })),
        api.get('/alerts').catch(() => ({ data: { alerts: [] } })),
        api.get('/weather?district=Warangal').catch(() => ({ data: { weather: null } })),
        api.get('/market?crop=Cotton&district=Warangal').catch(() => ({ data: { prices: [] } })),
      ]);

      setFarms(farmRes.data.farms || []);
      setAlerts(alertRes.data.alerts || []);
      setWeather(weatherRes.data.weather || {
        temperatureC: 31,
        humidityPercent: 68,
        windKm: 14,
        condition: 'Partly Cloudy',
        forecast: 'Moderate rainfall expected tomorrow afternoon.'
      });
      setMarketPrices(marketRes.data.prices || [
        { crop: 'Cotton', modalPriceQuintal: 7120, trend: '+330', market: 'Warangal Mandi' },
        { crop: 'Paddy (Rice)', modalPriceQuintal: 2300, trend: '+150', market: 'Nizamabad Mandi' },
        { crop: 'Chilli (Red)', modalPriceQuintal: 18500, trend: '+800', market: 'Khammam Mandi' },
        { crop: 'Maize', modalPriceQuintal: 2150, trend: '-40', market: 'Karimnagar Mandi' },
      ]);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeFarm = farms[0] || {
    farmName: 'Warangal South Farm',
    crop: 'Cotton (Bichu)',
    cropStage: 'Flowering & Fruiting',
    healthScore: 88,
    areaAcres: 5.0,
    soilType: 'Black Soil',
    irrigation: 'Drip System',
    location: 'Warangal, Telangana'
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleAskAI = (e) => {
    e.preventDefault();
    if (queryInput.trim()) {
      navigate(`/assistant?prompt=${encodeURIComponent(queryInput)}`);
    }
  };

  const quickPrompts = [
    'Calculate NPK fertilizer dosing for 5 acres cotton',
    'Pink Bollworm preventive spraying protocol',
    'PM-KISAN 17th Installment eligibility status',
    'Cotton market rate trend forecast for next week',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* Top Banner / Welcome Card */}
      <div className="glass-card p-6 sm:p-8 border-agri-500/30 bg-gradient-to-r from-slate-900 via-agri-950/50 to-slate-900 shadow-2xl relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-agri-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-agri-500/20 text-agri-300 border border-agri-500/30 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Real-Time Groq AI Farmer Intelligence</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-display">
              {getTimeGreeting()}, {user?.name || 'Farmer'} 👋
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="flex items-center gap-1 font-semibold text-agri-400">
                <Sprout className="w-4 h-4" /> {activeFarm.farmName}
              </span>
              <span className="text-slate-500">·</span>
              <span>{activeFarm.crop} ({activeFarm.cropStage})</span>
              <span className="text-slate-500">·</span>
              <span className="flex items-center gap-1 text-slate-400">
                <MapPin className="w-3.5 h-3.5" /> {activeFarm.location}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <Link
              to="/assistant"
              className="btn-primary py-3 px-5 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg shadow-agri-950/60"
            >
              <Cpu className="w-4 h-4 text-white" />
              <span>{t('dashboard.askGroq', 'Ask AgriQura AI')}</span>
            </Link>
            <Link
              to="/disease"
              className="btn-secondary py-3 px-4 text-xs sm:text-sm font-semibold flex items-center gap-2 bg-slate-900/90 border-slate-700 text-slate-200"
            >
              <Bug className="w-4 h-4 text-emerald-400" />
              <span>{t('nav.disease', 'Scan Crop Disease')}</span>
            </Link>
          </div>
        </div>

        {/* Quick Query Bar */}
        <form onSubmit={handleAskAI} className="mt-6 relative flex items-center">
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder={t('dashboard.queryPlaceholder', 'Ask AgriQura AI any agricultural query (e.g. fertilizer dose, pest control, weather)...')}
            className="input-field pr-28 pl-4 py-3.5 text-xs sm:text-sm rounded-xl bg-slate-950/90 border-slate-700/80 focus:border-agri-500 shadow-inner"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-agri-600 hover:bg-agri-500 text-white rounded-lg font-semibold text-xs transition-all flex items-center gap-1 shadow"
          >
            <span>Ask</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick Prompt Tags */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-[11px]">
          <span className="text-slate-400 font-medium shrink-0">Try asking:</span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => navigate(`/assistant?prompt=${encodeURIComponent(prompt)}`)}
              className="px-2.5 py-1 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-agri-500/40 text-slate-300 rounded-lg shrink-0 transition-all text-[11px]"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Key Telemetry Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* 1. Farm Health Gauge */}
        <div className="glass-card p-5 space-y-3 relative overflow-hidden border-agri-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Crop Health Index</span>
            <div className="p-2 bg-agri-500/20 text-agri-400 rounded-xl">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-white">{activeFarm.healthScore}%</span>
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Optimal
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-agri-400 to-amber-400 transition-all duration-500"
              style={{ width: `${activeFarm.healthScore}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 flex items-center gap-1">
            <Droplets className="w-3.5 h-3.5 text-blue-400" /> Soil Moisture: <span className="text-slate-200 font-semibold">64% (Optimal)</span>
          </p>
        </div>

        {/* 2. Real-Data Live Weather Widget */}
        <CompactWeatherWidget userFarms={farms} />

        {/* 3. Mandi Market Price */}
        <div className="glass-card p-5 space-y-3 border-emerald-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Cotton Mandi Rate</span>
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-extrabold text-white">₹7,120</span>
            <span className="text-xs text-slate-400 font-medium">/ quintal</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              ▲ +₹330 today
            </span>
            <span className="text-slate-400">Warangal Mandi</span>
          </div>
          <p className="text-[11px] text-slate-400 truncate">High demand in regional spinning mills.</p>
        </div>

        {/* 4. Smart Pest & Field Alert */}
        <div className="glass-card p-5 space-y-3 border-red-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-red-400">Active Smart Alerts</span>
            <div className="p-2 bg-red-500/20 text-red-400 rounded-xl">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1 text-xs text-slate-300">
            <p className="truncate font-semibold text-amber-300">• Moderate Pink Bollworm risk</p>
            <p className="truncate text-slate-400">• Hold pesticide application before rain</p>
          </div>
          <Link
            to="/alerts"
            className="text-xs text-agri-400 hover:text-agri-300 inline-flex items-center gap-1 font-bold pt-1 transition-colors"
          >
            <span>Open All Smart Alerts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

      {/* Mandi Rates Ticker Row */}
      <div className="glass-card p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">Live Regional Mandi Commodity Rates</h2>
          </div>
          <Link to="/market" className="text-xs text-agri-400 font-semibold hover:underline flex items-center gap-1">
            View All Mandis <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {marketPrices.map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white truncate">{item.crop}</span>
                <span className={`text-[10px] font-bold ${item.trend && item.trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                  {item.trend || ''}
                </span>
              </div>
              <div className="text-base font-extrabold text-agri-400">
                ₹{item.modalPriceQuintal.toLocaleString('en-IN')} <span className="text-[10px] text-slate-500 font-normal">/ Qtl</span>
              </div>
              <div className="text-[10px] text-slate-400 truncate">{item.market}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Agriculture Tools Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-white font-display">Farmer Advisory Suite</h2>
          <span className="text-xs text-slate-400">AI-Powered Farming Services</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          
          <Link to="/disease" className="glass-card glass-card-hover p-4 flex flex-col items-center text-center gap-2.5">
            <div className="p-3 bg-red-500/15 text-red-400 rounded-2xl border border-red-500/30">
              <Bug className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Disease Scan</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Upload Leaf Photo</div>
            </div>
          </Link>

          <Link to="/schemes" className="glass-card glass-card-hover p-4 flex flex-col items-center text-center gap-2.5">
            <div className="p-3 bg-amber-500/15 text-amber-400 rounded-2xl border border-amber-500/30">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Govt Schemes</div>
              <div className="text-[10px] text-slate-400 mt-0.5">PM-KISAN & Subsidy</div>
            </div>
          </Link>

          <Link to="/soil" className="glass-card glass-card-hover p-4 flex flex-col items-center text-center gap-2.5">
            <div className="p-3 bg-emerald-500/15 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Soil Advisory</div>
              <div className="text-[10px] text-slate-400 mt-0.5">NPK Fertilizer Dosing</div>
            </div>
          </Link>

          <Link to="/weather" className="glass-card glass-card-hover p-4 flex flex-col items-center text-center gap-2.5">
            <div className="p-3 bg-blue-500/15 text-blue-400 rounded-2xl border border-blue-500/30">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Weather Radar</div>
              <div className="text-[10px] text-slate-400 mt-0.5">7-Day Rain Forecast</div>
            </div>
          </Link>

          <Link to="/market" className="glass-card glass-card-hover p-4 flex flex-col items-center text-center gap-2.5">
            <div className="p-3 bg-purple-500/15 text-purple-400 rounded-2xl border border-purple-500/30">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Market Intel</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Mandi Price Trends</div>
            </div>
          </Link>

          <Link to="/expert" className="glass-card glass-card-hover p-4 flex flex-col items-center text-center gap-2.5">
            <div className="p-3 bg-agri-500/15 text-agri-400 rounded-2xl border border-agri-500/30">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Expert Connect</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Consult Agronomist</div>
            </div>
          </Link>

        </div>
      </div>

    </div>
  );
}

