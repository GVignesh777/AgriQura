import React, { useState } from 'react';
import api from '../services/api';
import { Activity, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function SoilHealth() {
  const [phLevel, setPhLevel] = useState('6.5');
  const [nitrogenRatio, setNitrogenRatio] = useState('160');
  const [phosphorusRatio, setPhosphorusRatio] = useState('22');
  const [potassiumRatio, setPotassiumRatio] = useState('175');
  const [soilType, setSoilType] = useState('Black Soil');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyzeSoil = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/soil/analyze', {
        phLevel: parseFloat(phLevel),
        nitrogenRatio: parseFloat(nitrogenRatio),
        phosphorusRatio: parseFloat(phosphorusRatio),
        potassiumRatio: parseFloat(potassiumRatio),
        soilType,
      });
      setReport(res.data.report);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
          <Activity className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-white">Soil & Fertilizer Advisory</h1>
        <p className="text-xs text-slate-400">Input soil test parameters to generate personalized NPK fertilizer dosing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <form onSubmit={handleAnalyzeSoil} className="glass-card p-6 space-y-4">
          <h2 className="text-lg font-bold text-white">Soil Parameters</h2>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Soil pH Level</label>
            <input
              type="number"
              step="0.1"
              value={phLevel}
              onChange={(e) => setPhLevel(e.target.value)}
              className="input-field text-sm"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Nitrogen (N)</label>
              <input
                type="number"
                value={nitrogenRatio}
                onChange={(e) => setNitrogenRatio(e.target.value)}
                className="input-field text-xs text-center"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Phosphorus (P)</label>
              <input
                type="number"
                value={phosphorusRatio}
                onChange={(e) => setPhosphorusRatio(e.target.value)}
                className="input-field text-xs text-center"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Potassium (K)</label>
              <input
                type="number"
                value={potassiumRatio}
                onChange={(e) => setPotassiumRatio(e.target.value)}
                className="input-field text-xs text-center"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Soil Type</label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="input-field text-sm"
            >
              <option value="Black Soil">Black Cotton Soil</option>
              <option value="Red Soil">Red Loamy Soil</option>
              <option value="Alluvial Soil">Alluvial Soil</option>
              <option value="Sandy Soil">Sandy Soil</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm">
            {loading ? 'Analyzing Soil Parameters...' : 'Calculate Fertilizer Dosage'}
          </button>
        </form>

        <div>
          {report ? (
            <div className="glass-card p-6 space-y-4 border-emerald-500/40">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Soil Health Summary</h3>

              <div>
                <h4 className="text-xs font-bold text-slate-300 mb-1">Identified Deficiencies:</h4>
                {report.aiAnalysis?.deficiencies?.length > 0 ? (
                  <ul className="text-xs text-amber-300 list-disc list-inside space-y-1">
                    {report.aiAnalysis.deficiencies.map((d, idx) => (
                      <li key={idx}>{d}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-emerald-400 font-semibold">✓ Soil nutrients are within optimal balance.</p>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-300 mb-1">Recommended Fertilizer Dosage:</h4>
                <ul className="text-xs text-slate-300 list-disc list-inside space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {report.aiAnalysis?.fertilizerDosage?.map((dos, idx) => (
                    <li key={idx}>{dos}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-300 mb-1">Organic Carbon Plan:</h4>
                <p className="text-xs text-slate-400">{report.aiAnalysis?.improvementPlan}</p>
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 text-center text-slate-500 space-y-2">
              <Activity className="w-12 h-12 mx-auto text-slate-700" />
              <p className="text-xs">Submit parameters to receive tailored soil health guidance.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
