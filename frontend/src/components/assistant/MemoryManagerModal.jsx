import React, { useState, useEffect } from 'react';
import {
  Brain,
  Plus,
  Trash2,
  X,
  Sparkles,
  Info,
  Check,
  Tag,
  AlertCircle,
} from 'lucide-react';
import api from '../../services/api';

const CATEGORIES = [
  { id: 'all', label: 'All Memories' },
  { id: 'farm_detail', label: 'Farm Details' },
  { id: 'crop_preference', label: 'Crops & Seeds' },
  { id: 'soil_data', label: 'Soil & Water' },
  { id: 'equipment', label: 'Equipment & Tech' },
  { id: 'custom_note', label: 'Custom Notes' },
];

export default function MemoryManagerModal({ isOpen, onClose, onMemoryUpdated }) {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAdding, setIsAdding] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('custom_note');
  const [statusMessage, setStatusMessage] = useState('');

  const fetchMemories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/assistant/memories');
      if (res.data && res.data.memories) {
        setMemories(res.data.memories);
      }
    } catch (err) {
      console.warn('⚠️ [Fetch Memories Error]:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMemories();
      setStatusMessage('');
      setIsAdding(false);
    }
  }, [isOpen]);

  const handleCreateMemory = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    try {
      const res = await api.post('/assistant/memories', {
        key: newKey.trim() || newContent.slice(0, 30),
        content: newContent.trim(),
        category: newCategory,
      });

      if (res.data && res.data.memory) {
        setMemories((prev) => [res.data.memory, ...prev]);
        setNewKey('');
        setNewContent('');
        setIsAdding(false);
        setStatusMessage('✨ Memory saved successfully!');
        setTimeout(() => setStatusMessage(''), 3000);
        if (onMemoryUpdated) onMemoryUpdated();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save memory');
    }
  };

  const handleDeleteMemory = async (memoryId) => {
    try {
      await api.delete(`/assistant/memories/${memoryId}`);
      setMemories((prev) => prev.filter((m) => m._id !== memoryId));
      if (onMemoryUpdated) onMemoryUpdated();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete memory');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all saved memories? AgriQura AI will forget all personalized details.')) {
      return;
    }

    try {
      await api.delete('/assistant/memories');
      setMemories([]);
      if (onMemoryUpdated) onMemoryUpdated();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to clear memories');
    }
  };

  if (!isOpen) return null;

  const filteredMemories = memories.filter((m) =>
    selectedCategory === 'all' ? true : m.category === selectedCategory
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 flex items-center justify-center shadow-lg shadow-purple-500/20 text-white">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  AgriQura Long-Term Memory
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {memories.length} Saved
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Personalized details remembered across all your farm conversations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informative Banner */}
        <div className="px-6 py-3 bg-gradient-to-r from-purple-950/40 to-slate-900 border-b border-purple-900/30 flex items-start gap-2.5 shrink-0">
          <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <p className="text-xs text-purple-200 leading-relaxed">
            <span className="font-semibold text-purple-300">How memory works:</span> AgriQura automatically remembers farm details when you say things like <em>"Remember that I planted 3 acres of cotton"</em> or <em>"Store this in memory: my soil pH is 7.2"</em>. You can also add or delete memories here anytime.
          </p>
        </div>

        {/* Category Filter & Add Button Bar */}
        <div className="px-6 py-3 border-b border-slate-800 flex items-center justify-between gap-2 overflow-x-auto shrink-0 scrollbar-none">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-950/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all shrink-0 border border-slate-700"
          >
            <Plus className="w-3.5 h-3.5 text-purple-400" />
            <span>{isAdding ? 'Cancel' : 'Add Memory'}</span>
          </button>
        </div>

        {/* Add Memory Form Dropdown */}
        {isAdding && (
          <form onSubmit={handleCreateMemory} className="p-5 bg-slate-950/90 border-b border-slate-800 space-y-3 shrink-0 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Memory Title / Key
                </label>
                <input
                  type="text"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="e.g. Soil Type, Drip Model, Budget"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="farm_detail">Farm Details</option>
                  <option value="crop_preference">Crops & Seeds</option>
                  <option value="soil_data">Soil & Water</option>
                  <option value="equipment">Equipment & Machinery</option>
                  <option value="custom_note">Custom Note</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Content / Detail to Remember
              </label>
              <textarea
                rows={2}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="e.g. I have 4.5 acres of black soil in Warangal, and I use solar fencing for wild boars."
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold shadow-md shadow-purple-950/60 transition-all"
              >
                Save to Memory
              </button>
            </div>
          </form>
        )}

        {/* Status Toast */}
        {statusMessage && (
          <div className="px-6 py-2 bg-emerald-500/20 text-emerald-300 border-b border-emerald-500/30 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Memories List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
          {loading ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span>Loading saved memories from MongoDB...</span>
            </div>
          ) : filteredMemories.length > 0 ? (
            filteredMemories.map((mem) => (
              <div
                key={mem._id}
                className="group relative p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 hover:border-purple-500/40 transition-all flex items-start justify-between gap-3 shadow-lg"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-purple-300">
                      {mem.key}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-slate-800 text-slate-400 border border-slate-700/60 uppercase">
                      {mem.category?.replace('_', ' ') || 'General'}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(mem.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    {mem.content}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteMemory(mem._id)}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all shrink-0"
                  title="Forget this memory"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <Brain className="w-10 h-10 mx-auto opacity-30 text-purple-400" />
              <p className="text-sm font-semibold text-slate-400">No saved memories found</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Tell AgriQura AI to remember something (e.g. your farm size, crop varieties, or soil type) or click "Add Memory" above.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            Memories are encrypted and stored in MongoDB under your farmer account.
          </span>

          {memories.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
            >
              Clear All Memory
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
