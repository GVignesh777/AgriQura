import React from 'react';
import { BookOpen, Search, FileText } from 'lucide-react';

export default function KnowledgeHub() {
  const articles = [
    {
      title: 'Pink Bollworm Integrated Pest Management (IPM) Guide',
      category: 'Pest Management',
      readTime: '4 min read',
      snippet: 'Learn how to install pheromone traps @ 8 traps/acre and apply Neem formulations during square formation to protect Cotton crop.',
    },
    {
      title: 'Soil Health Improvement using Farm Yard Manure (FYM)',
      category: 'Soil Health',
      readTime: '5 min read',
      snippet: 'Incorporate decomposed organic carbon sources before monsoon sowing to double soil moisture retention capacity.',
    },
    {
      title: 'Drip Irrigation Maintenance & Acid Treatment Procedures',
      category: 'Water Conservation',
      readTime: '3 min read',
      snippet: 'Step-by-step instructions on flushing drip laterals with Hydrochloric Acid to remove salt blockage in borewell irrigation.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-agri-400" /> Agricultural Knowledge Hub
        </h1>
        <p className="text-xs text-slate-400 mt-1">Search verified farming practices, pest management protocols, and soil guides.</p>
      </div>

      <div className="space-y-4">
        {articles.map((art, idx) => (
          <div key={idx} className="glass-card p-6 space-y-2 border-slate-800 hover:border-agri-500/40 transition-colors">
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-agri-500/10 text-agri-400 border border-agri-500/20 rounded">
              {art.category} · {art.readTime}
            </span>
            <h3 className="text-lg font-bold text-white mt-1">{art.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{art.snippet}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
