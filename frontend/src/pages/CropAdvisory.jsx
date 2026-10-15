import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Sprout, CheckCircle2, Calendar, Droplets } from 'lucide-react';

export default function CropAdvisory() {
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const res = await api.get('/crops');
      setCrops(res.data.crops || []);
      if (res.data.crops?.length > 0) setSelectedCrop(res.data.crops[0]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Sprout className="w-8 h-8 text-agri-400" /> Stage-Wise Crop Advisory
        </h1>
        <p className="text-xs text-slate-400 mt-1">Complete crop growth calendar from seed selection to post-harvest management.</p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {crops.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCrop(c)}
            className={`px-5 py-3 rounded-2xl font-bold text-xs whitespace-nowrap transition-all border ${
              selectedCrop?.id === c.id
                ? 'bg-agri-600 border-agri-500 text-white shadow-lg'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {c.name} ({c.category})
          </button>
        ))}
      </div>

      {selectedCrop && (
        <div className="glass-card p-6 space-y-6 border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 block">Total Duration</span>
              <p className="text-sm font-bold text-white flex items-center gap-1">
                <Calendar className="w-4 h-4 text-agri-400" /> {selectedCrop.durationDays} Days
              </p>
            </div>
            <div>
              <span className="text-slate-500 block">Ideal Soil Type</span>
              <p className="text-sm font-bold text-white">{selectedCrop.idealSoil}</p>
            </div>
            <div>
              <span className="text-slate-500 block">Water Requirement</span>
              <p className="text-sm font-bold text-white flex items-center gap-1">
                <Droplets className="w-4 h-4 text-blue-400" /> {selectedCrop.waterReq}
              </p>
            </div>
          </div>

          <h3 className="text-lg font-bold text-white">Growth Stage Roadmap</h3>

          <div className="space-y-4">
            {selectedCrop.stages.map((st, idx) => (
              <div key={idx} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-agri-400">{st.name} Stage</h4>
                  <span className="text-xs text-slate-500 font-semibold">Days {st.days}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{st.advice}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
