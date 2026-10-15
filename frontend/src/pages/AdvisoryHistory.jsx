import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { History, Cpu, MessageSquare } from 'lucide-react';

export default function AdvisoryHistory() {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    api.get('/assistant/conversations')
      .then((res) => setConversations(res.data.conversations || []))
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-agri-500/20 text-agri-400 rounded-2xl border border-agri-500/30">
          <History className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Advisory & Query History</h1>
          <p className="text-xs text-slate-400">Review past AI assistant conversations and pest recommendations.</p>
        </div>
      </div>

      <div className="space-y-3">
        {conversations.map((conv) => (
          <div key={conv._id} className="glass-card p-4 space-y-1 hover:border-agri-500/40 transition-colors">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-agri-400" /> {conv.title}
              </span>
              <span>{new Date(conv.lastMessageAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
