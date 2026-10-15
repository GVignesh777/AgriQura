import React, { useState } from 'react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle2,
  MapPin,
  UserCheck,
  Wheat,
  Coins,
  Layers,
  ShieldAlert,
  Loader2
} from 'lucide-react';

const INDIAN_STATES = [
  'All States & UTs',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Jammu and Kashmir',
  'Ladakh'
];

const FARMER_TYPES = [
  { id: 'Small', label: 'Small Farmer', desc: '1 to 2 Hectares (2.5 - 5 Acres)' },
  { id: 'Marginal', label: 'Marginal Farmer', desc: 'Up to 1 Hectare (< 2.5 Acres)' },
  { id: 'Tenant Farmer', label: 'Tenant / Lessee', desc: 'Cultivating leased or rented land' },
  { id: 'Sharecropper', label: 'Sharecropper', desc: 'Sharing crop yield with landowner' },
  { id: 'Medium', label: 'Medium Farmer', desc: '2 to 10 Hectares (5 - 25 Acres)' },
  { id: 'Large', label: 'Large Farmer', desc: 'Over 10 Hectares (> 25 Acres)' },
  { id: 'Farmer Producer Organization', label: 'FPO / SHG Group', desc: 'Farmer collective or cooperative' },
  { id: 'Other', label: 'Other Farmer Type', desc: 'All other agricultural categories' }
];

const CROPS = [
  'Cotton',
  'Rice',
  'Wheat',
  'Maize',
  'Pulses',
  'Oilseeds',
  'Vegetables',
  'Fruits',
  'Horticulture',
  'Millets',
  'Sugarcane',
  'Multiple Crops',
  'Other'
];

const SUPPORT_NEEDS = [
  { id: 'Financial Assistance', label: 'Financial / Direct Cash Support', icon: Coins },
  { id: 'Crop Insurance', label: 'Crop Insurance & Risk Protection', icon: ShieldAlert },
  { id: 'Irrigation', label: 'Drip / Sprinkler Irrigation Subsidies', icon: Layers },
  { id: 'Solar & Renewable Energy', label: 'Solar Water Pump (PM-KUSUM)', icon: Sparkles },
  { id: 'Equipment', label: 'Tractors & Farm Machinery (SMAM)', icon: Wheat },
  { id: 'Credit & Loans', label: 'Low-Interest Loans / KCC Card', icon: Coins },
  { id: 'Soil Health', label: 'Soil Health Card & Fertilizers', icon: CheckCircle2 },
  { id: 'Seeds', label: 'Certified Seeds & Subsidies', icon: Wheat },
  { id: 'Storage', label: 'Cold Storage & Warehousing (AIF)', icon: Layers },
  { id: 'Farmer Training', label: 'Organic Farming & Cluster Certification', icon: UserCheck }
];

const LANDHOLDING_RANGES = [
  { id: '<1 acre', label: 'Less than 1 Acre', desc: 'Sub-marginal holding' },
  { id: '1–2', label: '1 to 2 Acres', desc: 'Small marginal holding' },
  { id: '2–5', label: '2 to 5 Acres', desc: 'Small agricultural holding' },
  { id: '5–10', label: '5 to 10 Acres', desc: 'Medium agricultural holding' },
  { id: '>10 acres', label: 'More than 10 Acres', desc: 'Large agricultural land' }
];

export default function SchemeFinderWizard({ isOpen, onClose, onSubmitWizard, isLoading }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    state: 'Telangana',
    farmerType: 'Small',
    crop: 'Cotton',
    needs: ['Financial Assistance', 'Crop Insurance'],
    landholding: '2–5',
    exactAcres: ''
  });

  if (!isOpen) return null;

  const totalSteps = 5;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    } else {
      onSubmitWizard(formData);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const toggleNeed = (needId) => {
    setFormData((prev) => {
      const current = prev.needs || [];
      if (current.includes(needId)) {
        return { ...prev, needs: current.filter((n) => n !== needId) };
      } else {
        return { ...prev, needs: [...current, needId] };
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8">

        {/* Wizard Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Find Schemes That Match Your Needs</h2>
              <p className="text-xs text-slate-400">
                Step {step} of {totalSteps} — Profile Matching Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="w-full bg-slate-800 h-1.5">
          <div
            className="bg-gradient-to-r from-amber-500 to-agri-400 h-1.5 transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* Wizard Step Body */}
        <div className="p-6 sm:p-8 min-h-[320px]">

          {/* ──── STEP 1: STATE ──── */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold">
                <MapPin className="w-4 h-4" />
                <span>Select Your State / Location</span>
              </div>
              <p className="text-xs text-slate-300">
                Choosing your state unlocks specific State Government welfare grants alongside Central Government schemes.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                {INDIAN_STATES.map((st) => (
                  <button
                    key={st}
                    onClick={() => setFormData({ ...formData, state: st })}
                    className={`p-3 text-left rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${
                      formData.state === st
                        ? 'bg-amber-500/15 border-amber-500/60 text-amber-300 shadow-sm'
                        : 'bg-slate-800/60 border-slate-700/70 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{st}</span>
                    {formData.state === st && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ──── STEP 2: FARMER TYPE ──── */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold">
                <UserCheck className="w-4 h-4" />
                <span>What Best Describes Your Farming Category?</span>
              </div>
              <p className="text-xs text-slate-300">
                Many central subsidies (like SMAM mechanization or PM-KMY pensions) prioritize Small & Marginal farmers.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                {FARMER_TYPES.map((ft) => (
                  <button
                    key={ft.id}
                    onClick={() => setFormData({ ...formData, farmerType: ft.id })}
                    className={`p-3 text-left rounded-xl border text-xs transition-all flex items-start justify-between gap-2 ${
                      formData.farmerType === ft.id
                        ? 'bg-amber-500/15 border-amber-500/60 text-amber-300 shadow-sm'
                        : 'bg-slate-800/60 border-slate-700/70 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div>
                      <p className="font-bold">{ft.label}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{ft.desc}</p>
                    </div>
                    {formData.farmerType === ft.id && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ──── STEP 3: CROP ──── */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold">
                <Wheat className="w-4 h-4" />
                <span>Select Your Primary Crop</span>
              </div>
              <p className="text-xs text-slate-300">
                Helps identify specific crop insurance rates, special seed subsidies, and MSP support programs.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1">
                {CROPS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setFormData({ ...formData, crop: c })}
                    className={`p-3 text-center rounded-xl border text-xs font-semibold transition-all ${
                      formData.crop === c
                        ? 'bg-amber-500/15 border-amber-500/60 text-amber-300 shadow-sm'
                        : 'bg-slate-800/60 border-slate-700/70 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ──── STEP 4: SUPPORT NEEDED (MULTI-SELECT) ──── */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold">
                <Coins className="w-4 h-4" />
                <span>What Support Do You Need? (Select All That Apply)</span>
              </div>
              <p className="text-xs text-slate-300">
                Select your immediate farming priorities to rank the most relevant schemes first.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                {SUPPORT_NEEDS.map((sn) => {
                  const isSelected = formData.needs.includes(sn.id);
                  const Icon = sn.icon;
                  return (
                    <button
                      key={sn.id}
                      onClick={() => toggleNeed(sn.id)}
                      className={`p-3 text-left rounded-xl border text-xs transition-all flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500/60 text-amber-300 shadow-sm'
                          : 'bg-slate-800/60 border-slate-700/70 text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="font-semibold">{sn.label}</span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isSelected ? 'bg-amber-500 border-amber-500 text-slate-950' : 'border-slate-600'
                        }`}
                      >
                        {isSelected && '✓'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ──── STEP 5: LANDHOLDING ──── */}
          {step === 5 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold">
                <Layers className="w-4 h-4" />
                <span>Select Your Cultivable Land Size</span>
              </div>
              <p className="text-xs text-slate-300">
                Landholding dictates qualification under land ceilings for micro-irrigation, solar pumps, and cash transfers.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {LANDHOLDING_RANGES.map((lh) => (
                  <button
                    key={lh.id}
                    onClick={() => setFormData({ ...formData, landholding: lh.id })}
                    className={`p-3 text-left rounded-xl border text-xs transition-all flex items-start justify-between gap-2 ${
                      formData.landholding === lh.id
                        ? 'bg-amber-500/15 border-amber-500/60 text-amber-300 shadow-sm'
                        : 'bg-slate-800/60 border-slate-700/70 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div>
                      <p className="font-bold">{lh.label}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{lh.desc}</p>
                    </div>
                    {formData.landholding === lh.id && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Optional: Enter Exact Acreage
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 3.5 Acres"
                  value={formData.exactAcres}
                  onChange={(e) => setFormData({ ...formData, exactAcres: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

        </div>

        {/* Wizard Footer Navigation */}
        <div className="p-6 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 ${
              step === 1 ? 'opacity-40 cursor-not-allowed text-slate-500' : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            onClick={handleNext}
            disabled={isLoading}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-950/40 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Calculating Relevance...</span>
              </>
            ) : (
              <>
                <span>{step === totalSteps ? 'View Recommended Schemes' : 'Next Step'}</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
