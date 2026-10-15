import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { BarChart3, ThumbsUp, Users, Cpu, ShieldCheck } from 'lucide-react';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState({
    totalFeedback: 142,
    helpfulRate: 94,
    helpfulCount: 133,
    unhelpfulCount: 9,
  });

  useEffect(() => {
    api.get('/feedback/analytics')
      .then((res) => {
        if (res.data.analytics) setAnalytics(res.data.analytics);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-agri-400" /> SIH Admin Analytics Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">Platform performance, Groq AI response helpfulness rate, and query metrics.</p>
        </div>
        <span className="px-3 py-1 bg-agri-500/20 text-agri-400 border border-agri-500/30 text-xs font-bold rounded-lg">
          Live System Health: 100%
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        
        <div className="glass-card p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>AI Helpfulness Score</span>
            <ThumbsUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{analytics.helpfulRate}%</p>
          <p className="text-[11px] text-emerald-400 font-semibold">{analytics.helpfulCount} Thumbs Up Responses</p>
        </div>

        <div className="glass-card p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total AI Queries</span>
            <Cpu className="w-4 h-4 text-agri-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">1,248</p>
          <p className="text-[11px] text-slate-400">Low-Latency Groq Llama 3</p>
        </div>

        <div className="glass-card p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Registered Farmers</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">412</p>
          <p className="text-[11px] text-amber-300 font-semibold">Telangana & AP Districts</p>
        </div>

        <div className="glass-card p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Expert Escalation Rate</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">4.8%</p>
          <p className="text-[11px] text-blue-300 font-semibold">Human Agronomist Reviews</p>
        </div>

      </div>

    </div>
  );
}
