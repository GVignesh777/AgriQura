import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { AlertTriangle, Bell, CloudSun, TrendingUp, Bug } from 'lucide-react';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await api.get('/alerts');
      setAlerts(res.data.alerts || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
          <Bell className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Smart Farm Alerts</h1>
          <p className="text-xs text-slate-400">Actionable weather warnings, pest outbreak risks, and market surges.</p>
        </div>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert._id}
            className={`glass-card p-6 border-l-4 ${
              alert.severity === 'High' ? 'border-l-red-500' : 'border-l-amber-400'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-800 text-slate-300 rounded">
                  {alert.type} Alert
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{alert.title}</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{alert.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
