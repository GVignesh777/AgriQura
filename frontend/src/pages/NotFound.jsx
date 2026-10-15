import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-[20%] left-[20%] w-[30rem] h-[30rem] bg-rose-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[30rem] h-[30rem] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-xl w-full space-y-8 text-center relative z-10">
        
        {/* Animated Error Graphic */}
        <div className="flex justify-center animate-bounce">
          <div className="relative">
            <div className="absolute inset-0 bg-rose-500/20 rounded-3xl blur-2xl animate-pulse" />
            <div className="relative p-6 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/80 rounded-3xl backdrop-blur-xl shadow-2xl shadow-rose-900/20">
              <AlertTriangle className="w-20 h-20 text-rose-400 drop-shadow-[0_0_15px_rgba(244,63,94,0.4)]" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-100 to-slate-500 tracking-tighter">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Oops! You've strayed from the farm.
          </h2>
          <p className="text-slate-400 max-w-md mx-auto text-base">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
          
          <Link
            to="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-agri-600 to-emerald-600 hover:from-agri-500 hover:to-emerald-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-agri-900/30 transform hover:scale-[1.02]"
          >
            <Home className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
        
      </div>
    </div>
  );
}
