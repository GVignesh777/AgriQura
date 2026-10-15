import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Sprout, Plus, MapPin, Calendar, Activity, Trash2 } from 'lucide-react';

export default function MyFarm() {
  const [farms, setFarms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    farmName: '',
    areaAcres: '3.5',
    crop: 'Cotton',
    variety: 'Bt Cotton II',
    cropStage: 'Flowering',
    soilType: 'Black Soil',
    irrigationType: 'Drip',
    location: { state: 'Telangana', district: 'Warangal', village: 'Hanamkonda' },
    sowingDate: '2026-06-15',
  });

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      const res = await api.get('/farms');
      setFarms(res.data.farms || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddFarm = async (e) => {
    e.preventDefault();
    try {
      await api.post('/farms', formData);
      setShowModal(false);
      fetchFarms();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFarm = async (id) => {
    try {
      await api.delete(`/farms/${id}`);
      fetchFarms();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Sprout className="w-8 h-8 text-agri-400" /> My Farm Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage multiple farm plots, crop stage timelines, and soil telemetry.</p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn-primary text-xs py-2.5 px-4">
          <Plus className="w-4 h-4" /> Add New Farm Plot
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {farms.map((f) => (
          <div key={f._id} className="glass-card p-6 space-y-4 border-slate-800 hover:border-agri-500/40 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">{f.farmName}</h3>
                <p className="text-xs text-agri-400 font-semibold">{f.crop} ({f.variety})</p>
              </div>
              <span className="px-2.5 py-1 bg-agri-500/20 text-agri-400 border border-agri-500/30 text-[10px] font-bold rounded-lg">
                Stage: {f.cropStage}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
              <div>
                <span className="text-[10px] text-slate-500 block">Land Area</span>
                <p className="font-semibold text-white">{f.areaAcres} Acres</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Soil & Irrigation</span>
                <p className="font-semibold text-white">{f.soilType} · {f.irrigationType}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" /> {f.location?.district}, {f.location?.state}
              </span>
              <button onClick={() => handleDeleteFarm(f._id)} className="text-slate-500 hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Farm Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">Add Farm Plot</h2>
            <form onSubmit={handleAddFarm} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Farm Name</label>
                <input
                  type="text"
                  required
                  value={formData.farmName}
                  onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                  placeholder="North Acre Cotton Plot"
                  className="input-field text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Area (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.areaAcres}
                    onChange={(e) => setFormData({ ...formData, areaAcres: e.target.value })}
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Crop</label>
                  <input
                    type="text"
                    value={formData.crop}
                    onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                    className="input-field text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary w-full py-2.5 text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn-primary w-full py-2.5 text-xs">
                  Save Farm Plot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
