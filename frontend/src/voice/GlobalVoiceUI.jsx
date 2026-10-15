/**
 * AgriQura Global Voice HUD & Interactive Assistant Component
 * Siri-like floating intelligence bar matching AgriQura's premium theme.
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGlobalVoice, VOICE_STATES } from './GlobalVoiceProvider';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Cpu,
  X,
  Terminal,
  Square,
  AlertCircle,
  Radio,
  ChevronUp,
  ChevronDown,
  Globe,
} from 'lucide-react';

export default function GlobalVoiceUI() {
  const { t } = useTranslation();
  const {
    voiceState,
    isEnabled,
    transcript,
    lastResponse,
    lastIntent,
    activeProvider,
    errorMessage,
    isDebugOpen,
    currentLocale,
    enableQura,
    disableQura,
    triggerManualListen,
    stop,
    toggleDebug,
  } = useGlobalVoice();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showPermissionBanner, setShowPermissionBanner] = useState(!isEnabled);

  const isListening = voiceState === VOICE_STATES.LISTENING;
  const isSpeaking = voiceState === VOICE_STATES.SPEAKING;
  const isProcessing = voiceState === VOICE_STATES.PROCESSING || voiceState === VOICE_STATES.EXECUTING;
  const isWakeDetected = voiceState === VOICE_STATES.WAKE_WORD_DETECTED;
  const isError = voiceState === VOICE_STATES.ERROR;

  return (
    <>
      {/* Screen Reader Live Status Announcement */}
      <div className="sr-only" aria-live="polite">
        {voiceState === VOICE_STATES.LISTENING && 'Qura is listening for your command.'}
        {voiceState === VOICE_STATES.SPEAKING && `Qura speaking: ${lastResponse}`}
        {voiceState === VOICE_STATES.ERROR && errorMessage}
      </div>

      {/* ───── Fixed Floating HUD Container (Bottom-Right) ───── */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 font-sans select-none">

        {/* First-Run Permission / Activation Prompt (Collapsible) */}
        {!isEnabled && showPermissionBanner && (
          <div className="max-w-xs p-4 rounded-2xl bg-slate-900/95 border border-emerald-500/40 shadow-2xl backdrop-blur-xl text-xs space-y-2.5 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> {t('voice.enableQura', 'Activate "Hey Qura"')}
              </span>
              <button
                onClick={() => setShowPermissionBanner(false)}
                className="text-slate-400 hover:text-white p-0.5 rounded-lg"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {t('voice.heyQuraDesc', 'Qura can listen for the "Hey Qura" wake word while you explore AgriQura.')}
            </p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => {
                  enableQura();
                  setShowPermissionBanner(false);
                }}
                className="w-full py-2 bg-gradient-to-r from-emerald-600 to-agri-600 hover:from-emerald-500 hover:to-agri-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 text-xs"
              >
                <Mic className="w-3.5 h-3.5" /> {t('voice.enableQura', 'Enable Qura Voice')}
              </button>
            </div>
          </div>
        )}

        {/* ───── Main Siri-Like Interactive Voice Pill ───── */}
        <div
          className={`flex items-center gap-2 p-1.5 rounded-full border transition-all duration-300 backdrop-blur-2xl shadow-2xl ${
            isListening
              ? 'bg-slate-900/95 border-emerald-400 shadow-emerald-500/30 ring-2 ring-emerald-400/40 scale-105'
              : isSpeaking
              ? 'bg-slate-900/95 border-sky-400 shadow-sky-500/30 ring-2 ring-sky-400/40'
              : isProcessing
              ? 'bg-slate-900/95 border-amber-400 shadow-amber-500/30 ring-2 ring-amber-400/40'
              : isWakeDetected
              ? 'bg-slate-900/95 border-emerald-400 animate-pulse'
              : isError
              ? 'bg-slate-900/95 border-red-500 shadow-red-500/20'
              : isEnabled
              ? 'bg-slate-900/90 border-slate-700/80 hover:border-emerald-500/50 hover:bg-slate-850'
              : 'bg-slate-900/80 border-slate-800 opacity-90 hover:opacity-100'
          }`}
        >
          {/* Main Action Trigger Button */}
          <button
            onClick={triggerManualListen}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 relative ${
              isListening
                ? 'bg-emerald-500 text-slate-950 shadow-lg animate-pulse'
                : isSpeaking
                ? 'bg-sky-500 text-slate-950 shadow-lg'
                : isProcessing
                ? 'bg-amber-500 text-slate-950 shadow-lg animate-spin'
                : isEnabled
                ? 'bg-gradient-to-tr from-emerald-600 to-agri-500 text-white hover:scale-105 shadow-md shadow-emerald-950/50'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
            title={isEnabled ? t('voice.sayHeyQura', 'Say "Hey Qura" or Tap to speak') : t('voice.enableQura', 'Enable Qura Voice')}
            aria-label="Voice Assistant Control"
          >
            {isListening ? (
              <Radio className="w-5 h-5 animate-pulse" />
            ) : isSpeaking ? (
              <Volume2 className="w-5 h-5 animate-bounce" />
            ) : isProcessing ? (
              <Cpu className="w-5 h-5" />
            ) : isEnabled ? (
              <Mic className="w-5 h-5" />
            ) : (
              <MicOff className="w-5 h-5" />
            )}
          </button>

          {/* Status Label & Waveform Animation */}
          <div
            onClick={() => setIsExpanded((prev) => !prev)}
            className="flex items-center gap-2 pr-2 cursor-pointer text-xs"
          >
            <div className="flex flex-col">
              <span className="font-extrabold text-white text-[13px] flex items-center gap-1 leading-tight">
                {isListening ? (
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    {t('voice.listening', 'Listening…')}
                    <span className="flex gap-0.5 items-end h-3">
                      <span className="w-1 bg-emerald-400 h-2 animate-pulse" />
                      <span className="w-1 bg-emerald-400 h-3 animate-pulse delay-75" />
                      <span className="w-1 bg-emerald-400 h-1.5 animate-pulse delay-150" />
                    </span>
                  </span>
                ) : isSpeaking ? (
                  <span className="text-sky-400 flex items-center gap-1.5">
                    {t('voice.speaking', 'Speaking…')}
                    <span className="flex gap-0.5 items-end h-3">
                      <span className="w-1 bg-sky-400 h-3 animate-pulse" />
                      <span className="w-1 bg-sky-400 h-2 animate-pulse delay-75" />
                      <span className="w-1 bg-sky-400 h-3.5 animate-pulse delay-150" />
                    </span>
                  </span>
                ) : isProcessing ? (
                  <span className="text-amber-400">{t('voice.thinking', 'Thinking…')}</span>
                ) : isWakeDetected ? (
                  <span className="text-emerald-300">{t('voice.heyQuraDetected', 'Hey Qura!')}</span>
                ) : isError ? (
                  <span className="text-red-400">{t('common.tryAgain', 'Try Again')}</span>
                ) : isEnabled ? (
                  <span className="text-slate-200">{t('voice.quraLive', 'Qura Live')}</span>
                ) : (
                  <span className="text-slate-400">{t('voice.quraOff', 'Qura Off')}</span>
                )}
              </span>

              <span className="text-[10px] text-slate-400 font-medium">
                {isEnabled ? t('voice.sayHeyQura', 'Say "Hey Qura"') : t('voice.tapToSpeak', 'Tap to start')}
              </span>
            </div>

            {/* Quick Stop Button when Active */}
            {(isListening || isSpeaking || isProcessing) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  stop();
                }}
                className="p-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-full transition-colors ml-1"
                title={t('voice.stop', 'Stop / Interrupt (Esc)')}
              >
                <Square className="w-3 h-3 fill-current" />
              </button>
            )}
          </div>
        </div>

        {/* ───── Expanded Status & Transcript HUD Modal ───── */}
        {isExpanded && (
          <div className="w-80 p-4 rounded-3xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-2xl text-xs space-y-3 animate-fade-in-up">
            
            {/* Header & Toggle */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-extrabold text-white text-sm">Hey Qura Intelligence</span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Spoken Transcript Box */}
            {transcript && (
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">{t('voice.youSaid', 'You Said:')}</span>
                <p className="text-white font-medium text-xs">"{transcript}"</p>
              </div>
            )}

            {/* Last Response */}
            {lastResponse && (
              <div className="p-3 bg-emerald-950/30 rounded-2xl border border-emerald-500/30 space-y-1 text-slate-200">
                <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider flex items-center gap-1">
                  <Volume2 className="w-3 h-3" /> {t('voice.aiVoiceResponse', 'Qura Spoke:')}
                </span>
                <p className="font-semibold text-white text-xs">{lastResponse}</p>
              </div>
            )}

            {/* Quick Controls */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <button
                onClick={isEnabled ? disableQura : enableQura}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  isEnabled
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isEnabled ? t('voice.disableQura', 'Disable Voice') : t('voice.enableQura', 'Enable Voice')}
              </button>

              <button
                onClick={toggleDebug}
                className="text-slate-400 hover:text-emerald-400 flex items-center gap-1 font-semibold text-[11px]"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>{isDebugOpen ? 'Hide Debug' : 'Dev Debug'}</span>
              </button>
            </div>

            {/* Dev-Only Debug Inspector Panel (Section 13) */}
            {isDebugOpen && (
              <div className="pt-2 border-t border-slate-800/80 space-y-2 text-[11px] font-mono text-slate-300 bg-slate-950/80 p-3 rounded-2xl border">
                <div className="flex justify-between">
                  <span className="text-slate-500">Wake Word:</span>
                  <span className="text-emerald-400 font-bold">{isEnabled ? 'ACTIVE' : 'OFF'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Locale:</span>
                  <span className="text-sky-400">{currentLocale}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Intent:</span>
                  <span className="text-amber-400">{lastIntent || 'NONE'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">TTS Provider:</span>
                  <span className="text-emerald-400 uppercase font-bold">{activeProvider}</span>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </>
  );
}
