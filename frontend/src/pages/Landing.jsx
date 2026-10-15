import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroScene from '../components/three/HeroScene';
import heroBackground from '../assets/BackgroundImage.png';
import {
  Cpu,
  Mic,
  Bug,
  CloudSun,
  TrendingUp,
  Landmark,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Sprout,
  Users,
  Compass
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="relative min-h-screen">

      {/* ───── Farm Background with Black & Gray Gradient Overlay ───── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Farm Background Image */}
        <img
          src={heroBackground}
          alt="AgriQura Farm Background"
          className="w-full h-full object-cover object-center opacity-85 select-none"
        />

        {/* Top-to-Bottom Black to Charcoal/Gray Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-slate-900/35 to-black/90" />

        {/* Smooth Radial Black/Gray Contrast Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 30% 35%, rgba(30, 41, 59, 0.15) 20%, rgba(15, 23, 42, 0.45) 90%, rgba(2, 6, 23, 0.9) 90%)'
          }}
        />

        {/* Ambient Subtle Emerald Accent */}
        <div className="absolute top-1/4 right-1/10 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ───── Page Content (Foreground) ───── */}
      <div className="relative z-10 space-y-20 py-8 sm:py-12">

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 lg:pr-4"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-950/80 border border-agri-500/40 rounded-full text-xs font-semibold text-agri-300 backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 bg-agri-400 rounded-full animate-ping" />
              <span>Smart India Hackathon • Developed & Owned by GVignesh</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              AI-Powered Intelligence for Every <span className="gradient-text-agri">Indian Farmer</span>
            </h1>

            <p className="text-slate-100 text-base sm:text-lg leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] max-w-xl font-medium">
              AgriQura combines low-latency <strong className="text-white font-bold">Groq Llama 3 AI</strong>, voice interaction in 11 regional languages, computer-vision disease screening, and live Mandi market intelligence to deliver reliable agricultural guidance.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/register" className="btn-primary text-base py-3.5 px-8 shadow-2xl shadow-black/80 hover:scale-[1.02] transition-all font-bold">
                Start Free Advisory <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
              <Link to="/assistant" className="btn-secondary text-base py-3.5 px-6 bg-slate-950/80 border-slate-700/80 hover:bg-slate-900 text-white backdrop-blur-md font-semibold shadow-xl">
                <Cpu className="w-5 h-5 text-agri-400 mr-1" /> Try Groq AI Assistant
              </Link>
            </div>

            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/20 text-white">
              <div className="bg-slate-950/60 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 shadow-lg">
                <p className="text-2xl sm:text-3xl font-extrabold text-white">99.2%</p>
                <p className="text-xs text-slate-200 mt-0.5 font-medium">Low-Latency Groq AI</p>
              </div>
              <div className="bg-slate-950/60 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 shadow-lg">
                <p className="text-2xl sm:text-3xl font-extrabold text-white">10+</p>
                <p className="text-xs text-slate-200 mt-0.5 font-medium">Regional Languages</p>
              </div>
              <div className="bg-slate-950/60 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 shadow-lg">
                <p className="text-2xl sm:text-3xl font-extrabold text-white">3500+</p>
                <p className="text-xs text-slate-200 mt-0.5 font-medium">Live Mandi Prices</p>
              </div>
            </div>
          </motion.div>

          {/* 3D Visualizer Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <HeroScene />
          </motion.div>
        </section>

        {/* Feature Showcase Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl font-bold text-white tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              Designed for Limited Technical Literacy
            </h2>
            <p className="text-slate-100 text-sm leading-relaxed drop-shadow-md font-medium">
              Simple voice inputs, large accessible buttons, localized regional language translations, and actionable step-by-step agricultural guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="glass-card glass-card-hover p-6 space-y-3 bg-slate-950/75 border-slate-700/80 backdrop-blur-xl shadow-2xl">
              <div className="w-12 h-12 bg-agri-500/20 text-agri-400 rounded-2xl flex items-center justify-center border border-agri-500/40 shadow-inner">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Voice & 11 Regional Languages</h3>
              <p className="text-xs text-slate-200 leading-relaxed">
                Ask questions naturally in Telugu, Hindi, Tamil, Kannada, Marathi, Bengali, Punjabi, Gujarati, and English with voice speech-to-text.
              </p>
            </div>

            <div className="glass-card glass-card-hover p-6 space-y-3 bg-slate-950/75 border-slate-700/80 backdrop-blur-xl shadow-2xl">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-500/40 shadow-inner">
                <Bug className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">AI Crop Disease Screening</h3>
              <p className="text-xs text-slate-200 leading-relaxed">
                Snap leaf photos to receive instant symptoms detection, organic/chemical treatment options, and proactive prevention steps.
              </p>
            </div>

            <div className="glass-card glass-card-hover p-6 space-y-3 bg-slate-950/75 border-slate-700/80 backdrop-blur-xl shadow-2xl">
              <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center border border-amber-500/40 shadow-inner">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Live Agmarknet Mandi Rates</h3>
              <p className="text-xs text-slate-200 leading-relaxed">
                Track real-time crop prices, modal rates, and MSP spread across 3,500+ agricultural market yards nationwide.
              </p>
            </div>

          </div>
        </section>

        {/* Trust & Safety Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 border-agri-500/40 bg-slate-950/85 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl rounded-3xl">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-7 h-7 text-agri-400" />
                Verified Agricultural Advisory Safety
              </h3>
              <p className="text-slate-200 text-xs max-w-2xl leading-relaxed">
                AgriQura system prompts automatically flag low-confidence predictions and facilitate immediate escalation to certified agricultural experts (KVK agronomists) with full context.
              </p>
            </div>
            <Link to="/register" className="btn-primary whitespace-nowrap px-7 py-3.5 text-sm shadow-xl shadow-agri-950/80 font-bold">
              Get Started Now
            </Link>
          </div>
        </section>

        {/* Developer & Owner Spotlight */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-6 sm:p-8 border-slate-700/80 bg-slate-950/85 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-agri-500 via-emerald-500 to-teal-400 flex items-center justify-center text-white font-extrabold text-2xl shadow-xl shadow-agri-500/20 shrink-0">
                GV
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-bold text-white">GVignesh</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-agri-500/20 border border-agri-500/40 text-agri-300 text-[11px] font-bold">
                    Developer & Owner
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold">
                    Lead System Architect
                  </span>
                </div>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                  AgriQura AI was architected, engineered, and is owned by <strong>GVignesh</strong> to empower Indian farmers with low-latency LLM advisory, computer-vision disease diagnosis, and live mandi intelligence.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end">
              <a
                href="https://github.com/GVignesh777"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary py-3 px-5 text-xs font-semibold bg-slate-900 border-slate-700 hover:bg-slate-800 text-white flex items-center gap-2"
              >
                <span>GitHub Profile</span>
              </a>
              <Link
                to="/contact"
                className="btn-primary py-3 px-6 text-xs font-bold"
              >
                Contact Owner
              </Link>
            </div>
          </div>
        </section>

      </div>

    </div>
  );
}
