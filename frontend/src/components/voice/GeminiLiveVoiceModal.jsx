import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Square, Radio, Sparkles, Volume2, X, MessageSquare, PhoneOff, Globe, Trash2 } from 'lucide-react';

/**
 * AgriQura Gemini Live & Siri 3D Motion Voice Conference Modal
 * Features:
 * - 60FPS Siri-like multi-harmonic undulating 3D wave visualizer (Canvas)
 * - Gemini Live real-time word-by-word synchronized speech and caption highlighting
 * - Smooth state transitions (Listening, Thinking, Speaking, Idle)
 */
export default function GeminiLiveVoiceModal({
  isOpen,
  onClose,
  voiceOrbState, // 'listening' | 'thinking' | 'speaking' | 'idle'
  liveVoiceTranscript,
  activeAiResponse,
  speakingCharIndex = 0,
  onStartListening,
  onStopListening,
  onInterruptSpeaking,
  currentLanguage = 'en-IN',
  userQuestion = '',
  onClearText,
}) {
  const canvasRef = useRef(null);
  const wordsContainerRef = useRef(null);
  const activeWordRef = useRef(null);
  const [callDuration, setCallDuration] = useState(0);

  // Call duration counter
  useEffect(() => {
    if (!isOpen) {
      setCallDuration(0);
      return;
    }
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 60FPS Siri-like Multi-Harmonic Undulating 3D Wave Visualizer
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let phase = 0;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Wave parameters
    const waves = [
      { color: 'rgba(16, 185, 129, 0.85)', speed: 0.04, frequency: 0.012, baseAmp: 28, glow: '#10b981' },
      { color: 'rgba(6, 182, 212, 0.75)', speed: 0.03, frequency: 0.015, baseAmp: 22, glow: '#06b6d4' },
      { color: 'rgba(168, 85, 247, 0.7)', speed: 0.05, frequency: 0.018, baseAmp: 18, glow: '#a855f7' },
      { color: 'rgba(245, 158, 11, 0.65)', speed: 0.025, frequency: 0.01, baseAmp: 14, glow: '#f59e0b' },
    ];

    const render = () => {
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // State-dependent amplitude scaling
      let ampMultiplier = 0.25;
      if (voiceOrbState === 'listening') ampMultiplier = 0.9 + Math.sin(phase * 3) * 0.3;
      if (voiceOrbState === 'speaking') ampMultiplier = 1.4 + Math.sin(phase * 4) * 0.4;
      if (voiceOrbState === 'thinking') ampMultiplier = 0.5 + Math.sin(phase * 2) * 0.2;

      phase += 0.03;

      // Draw Siri multi-frequency wave ribbons
      waves.forEach((wave, idx) => {
        ctx.save();
        ctx.beginPath();
        ctx.shadowColor = wave.glow;
        ctx.shadowBlur = voiceOrbState === 'speaking' ? 22 : 12;
        ctx.lineWidth = idx === 0 ? 3.5 : 2.2;
        ctx.strokeStyle = wave.color;

        const currentAmp = wave.baseAmp * ampMultiplier;

        for (let x = 0; x <= width; x += 3) {
          // Bell-curve attenuation at ends for organic Siri ribbon look
          const normX = x / width;
          const envelope = Math.sin(normX * Math.PI);

          const y =
            centerY +
            Math.sin(x * wave.frequency + phase * (idx + 1) * 0.8) *
              currentAmp *
              envelope *
              Math.cos(phase * wave.speed + idx);

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
        ctx.restore();
      });

      // Orbital glow particle in thinking state
      if (voiceOrbState === 'thinking') {
        const radius = 45;
        const particleX = width / 2 + Math.cos(phase * 3) * radius;
        const particleY = centerY + Math.sin(phase * 3) * radius * 0.5;

        ctx.save();
        ctx.beginPath();
        ctx.arc(particleX, particleY, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen, voiceOrbState]);

  // Auto-scroll word container to follow synchronized speaking word
  useEffect(() => {
    if (activeWordRef.current && wordsContainerRef.current) {
      activeWordRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [speakingCharIndex]);

  if (!isOpen) return null;

  // Split response text into words and compute char offsets for synchronization
  const cleanResponse = (activeAiResponse || '').replace(/[*#_`]/g, '').trim();
  const words = [];
  if (cleanResponse) {
    let runningIndex = 0;
    const rawWords = cleanResponse.split(/(\s+)/);
    rawWords.forEach((token) => {
      if (token.trim().length > 0) {
        words.push({
          word: token,
          startIndex: runningIndex,
          endIndex: runningIndex + token.length,
        });
      }
      runningIndex += token.length;
    });
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-3xl flex flex-col justify-between p-4 sm:p-8 animate-fade-in select-none">
      
      {/* Background Chromatic Radial Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] sm:w-[550px] sm:h-[550px] rounded-full blur-[140px] transition-all duration-1000 ${
            voiceOrbState === 'listening'
              ? 'bg-emerald-500/20 scale-125'
              : voiceOrbState === 'speaking'
              ? 'bg-sky-500/25 scale-130'
              : voiceOrbState === 'thinking'
              ? 'bg-amber-500/20 scale-110'
              : 'bg-slate-700/10 scale-90'
          }`}
        />
      </div>

      {/* Top Bar: Conference Status & Call Info */}
      <div className="relative z-10 flex items-center justify-between max-w-4xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-sm sm:text-base tracking-wide flex items-center gap-1.5">
                <span>AgriQura Live Intelligence</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live
                </span>
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>{formatDuration(callDuration)}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3 text-slate-500" />
                <span>{currentLanguage}</span>
              </span>
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-2.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-full transition-all shadow-lg"
          title="Switch to Chat Text View"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Center Zone: Siri 3D Wave Visualizer & Synchronized Text */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-3xl w-full mx-auto my-auto space-y-6">
        
        {/* User Query Subtitle Bubble */}
        {(userQuestion || liveVoiceTranscript) && (
          <div className="w-full text-center px-4 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-slate-900/90 border border-slate-800 text-slate-200 px-4 py-2 rounded-2xl shadow-xl max-w-lg">
              <Mic className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
              <p className="text-xs sm:text-sm font-medium text-left truncate">
                {liveVoiceTranscript || userQuestion}
              </p>
            </div>
          </div>
        )}

        {/* Siri 3D Harmonic Wave Canvas */}
        <div className="relative w-full h-36 sm:h-48 flex items-center justify-center">
          <canvas ref={canvasRef} className="w-full h-full" />

          {/* Central Touch-Sensitive Orb */}
          <div
            onClick={voiceOrbState === 'listening' ? onStopListening : onStartListening}
            className={`absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-500 border-2 select-none backdrop-blur-xl shadow-2xl ${
              voiceOrbState === 'listening'
                ? 'bg-gradient-to-tr from-emerald-600/90 via-teal-500/80 to-agri-400/90 border-emerald-300 shadow-emerald-500/50 scale-110 ring-4 ring-emerald-400/30'
                : voiceOrbState === 'speaking'
                ? 'bg-gradient-to-tr from-sky-600/90 via-cyan-500/80 to-blue-400/90 border-sky-300 shadow-sky-500/50 scale-105 ring-4 ring-sky-400/30'
                : voiceOrbState === 'thinking'
                ? 'bg-gradient-to-tr from-amber-600/90 via-orange-500/80 to-yellow-400/90 border-amber-300 shadow-amber-500/50 scale-100 ring-4 ring-amber-400/30'
                : 'bg-slate-900/90 border-slate-700 hover:scale-105 shadow-slate-950/80'
            }`}
          >
            {voiceOrbState === 'listening' ? (
              <Radio className="w-8 h-8 text-white animate-pulse" />
            ) : voiceOrbState === 'speaking' ? (
              <Volume2 className="w-8 h-8 text-white animate-bounce" />
            ) : voiceOrbState === 'thinking' ? (
              <Sparkles className="w-8 h-8 text-white animate-spin" />
            ) : (
              <Mic className="w-8 h-8 text-slate-300" />
            )}

            <span className="text-[9px] font-bold text-white uppercase tracking-wider mt-1">
              {voiceOrbState === 'listening'
                ? 'Listening'
                : voiceOrbState === 'speaking'
                ? 'Speaking'
                : voiceOrbState === 'thinking'
                ? 'Thinking'
                : 'Tap to Speak'}
            </span>
          </div>
        </div>

        {/* Gemini Live Synchronized Response Transcript */}
        <div
          ref={wordsContainerRef}
          className="w-full max-h-48 sm:max-h-56 overflow-y-auto px-4 py-2 text-center text-base sm:text-lg md:text-xl leading-relaxed tracking-wide scroll-smooth transition-all"
        >
          {cleanResponse ? (
            <p className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1">
              {words.map((item, idx) => {
                const isSpoken = item.endIndex <= speakingCharIndex;
                const isCurrent =
                  speakingCharIndex >= item.startIndex && speakingCharIndex < item.endIndex;

                return (
                  <span
                    key={idx}
                    ref={isCurrent ? activeWordRef : null}
                    className={`transition-all duration-150 rounded px-1 py-0.5 ${
                      isCurrent
                        ? 'text-emerald-300 font-extrabold bg-emerald-500/20 border border-emerald-400/40 shadow-lg scale-110 drop-shadow-[0_0_12px_rgba(16,185,129,0.9)]'
                        : isSpoken
                        ? 'text-white font-medium opacity-95'
                        : 'text-slate-500 font-normal opacity-50'
                    }`}
                  >
                    {item.word}
                  </span>
                );
              })}
            </p>
          ) : (
            <p className="text-sm sm:text-base text-slate-400 italic">
              {voiceOrbState === 'listening'
                ? 'Listening to your agricultural question...'
                : voiceOrbState === 'thinking'
                ? 'Analyzing crop advisories and preparing live answer...'
                : 'Tap the center wave orb to start speaking.'}
            </p>
          )}
        </div>

      </div>

      {/* Bottom Conference HUD Controls */}
      <div className="relative z-10 max-w-md w-full mx-auto flex items-center justify-center gap-4 pt-4">
        
        {/* Switch to Text View */}
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-5 py-3 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white rounded-2xl text-xs font-bold transition-all shadow-xl hover:scale-105 active:scale-95"
          title="Switch to Text View"
        >
          <MessageSquare className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">Text View</span>
        </button>

        {/* Clear Text Button */}
        <button
          onClick={onClearText}
          className="p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-2xl transition-all shadow-xl hover:scale-105 active:scale-95"
          title="Clear On-Screen Text"
        >
          <Trash2 className="w-5 h-5 text-red-400" />
        </button>

        {/* Mic Toggle Button */}
        <button
          onClick={voiceOrbState === 'listening' ? onStopListening : onStartListening}
          className={`p-4 rounded-2xl font-bold transition-all shadow-2xl hover:scale-105 active:scale-95 border ${
            voiceOrbState === 'listening'
              ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-emerald-500/40 ring-4 ring-emerald-400/30'
              : 'bg-slate-900 border-slate-700 text-white hover:bg-slate-800'
          }`}
          title={voiceOrbState === 'listening' ? 'Mute Microphone' : 'Start Speaking'}
        >
          {voiceOrbState === 'listening' ? (
            <MicOff className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5 text-emerald-400" />
          )}
        </button>

        {/* Interrupt / Stop Speaking Button */}
        {voiceOrbState === 'speaking' && (
          <button
            onClick={onInterruptSpeaking}
            className="p-4 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-2xl transition-all shadow-lg hover:scale-105 active:scale-95"
            title="Interrupt AI Speaking"
          >
            <Square className="w-5 h-5 fill-current" />
          </button>
        )}

        {/* End Call Button */}
        <button
          onClick={onClose}
          className="p-4 bg-red-600/90 hover:bg-red-500 text-white rounded-2xl transition-all shadow-xl shadow-red-950/80 border border-red-400/40 hover:scale-105 active:scale-95"
          title="End Live Voice Call"
        >
          <PhoneOff className="w-5 h-5" />
        </button>

      </div>

    </div>
  );
}
