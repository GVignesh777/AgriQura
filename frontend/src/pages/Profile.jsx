import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Phone, MapPin, Globe, CheckCircle2, LogOut, ShieldCheck, Mail, Save, Sprout } from 'lucide-react';

export default function Profile() {
  const { user, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferredLanguage || 'en');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    try {
      if (updateUserProfile) {
        await updateUserProfile({ name, phone, preferredLanguage });
      } else {
        await api.put('/users/profile', { name, phone, preferredLanguage });
      }
      setSaved(true);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-card p-6 border-agri-500/30 bg-gradient-to-r from-slate-900 via-agri-950/40 to-slate-900 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-agri-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-agri-900/50">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'F'}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">{user?.name || 'Farmer Profile'}</h1>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-agri-400" /> {user?.email}
            </p>
          </div>
        </div>
        <span className="px-3 py-1 bg-agri-500/20 text-agri-400 border border-agri-500/30 rounded-xl text-xs font-bold uppercase tracking-wider">
          {user?.role || 'Farmer'}
        </span>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-400 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* Account Settings Form */}
      <form onSubmit={handleSave} className="glass-card p-6 sm:p-8 space-y-5 shadow-2xl">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <Sprout className="w-5 h-5 text-agri-400" />
          <h2 className="text-base font-bold text-white">Personal & Language Preferences</h2>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field pl-10 text-xs sm:text-sm"
              placeholder="e.g. Vignesh"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Registered Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="input-field pl-10 text-xs sm:text-sm opacity-60 cursor-not-allowed bg-slate-950"
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Email address is verified and locked to your account.</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone Number</label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-field pl-10 text-xs sm:text-sm"
              placeholder="+91 98855XXXXX"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-agri-400" />
            <span>Preferred Advisory Language</span>
          </label>
          <select
            value={preferredLanguage}
            onChange={(e) => setPreferredLanguage(e.target.value)}
            className="input-field text-xs sm:text-sm bg-slate-900"
          >
            <option value="en">English 🇬🇧</option>
            <option value="hi">हिंदी (Hindi) 🇮🇳</option>
            <option value="te">తెలుగు (Telugu) 🏛️</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3.5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xl shadow-agri-950/50"
        >
          {loading ? (
            <span>Saving Changes...</span>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Profile Changes
            </>
          )}
        </button>
      </form>

      {/* DANGER ZONE: PROMINENT SIGN OUT BUTTON */}
      <div className="glass-card p-6 border-red-500/30 bg-red-500/5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Account Session</h3>
            <p className="text-xs text-slate-400 mt-0.5">Sign out from your active AgriQura AI session on this device.</p>
          </div>
          <button
            onClick={handleSignOut}
            className="px-5 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            Sign Out
          </button>
        </div>
      </div>

    </div>
  );
}

