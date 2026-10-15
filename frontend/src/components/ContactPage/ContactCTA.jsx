import React from 'react';
import { Sprout, Cpu, Globe, Lock, ShieldCheck } from 'lucide-react';

export default function ContactCTA() {
  const trustPoints = [
    { icon: Sprout, title: 'Farmer First', desc: 'Designed for rural accessibility & easy navigation' },
    { icon: Cpu, title: 'AI Assisted', desc: 'Low-latency Groq Llama 3 agricultural intelligence' },
    { icon: Globe, title: '11 Regional Languages', desc: 'Telugu, Hindi, Tamil, Kannada, Marathi & more' },
    { icon: Lock, title: 'Privacy Focused', desc: 'Protected data handling & strict farmer consent' }
  ];

  return (
    <section className="p-8 sm:p-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl space-y-6 shadow-2xl">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h3 className="text-2xl font-extrabold text-white">Built for Indian Farmers</h3>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          AgriQura is engineered to make agricultural information easier to access, understand, and act upon with genuine human and AI support.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {trustPoints.map((tp) => {
          const Icon = tp.icon;
          return (
            <div
              key={tp.title}
              className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 text-center flex flex-col items-center"
            >
              <div className="w-10 h-10 rounded-xl bg-agri-500/15 border border-agri-500/30 text-agri-400 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white">{tp.title}</h4>
              <p className="text-[11px] text-slate-400 leading-tight">{tp.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
