import React, { useState, useRef } from 'react';
import {
  Mic,
  MicOff,
  Globe,
  RotateCcw,
  CheckCircle2,
  Volume2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function VoiceContact() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedText, setRecordedText] = useState('');
  const [language, setLanguage] = useState('te-IN');
  const [status, setStatus] = useState('idle'); // 'idle' | 'recording' | 'recorded'
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  const startVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice speech recognition is not supported in this browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language;
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsRecording(true);
        setStatus('recording');
      };

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setRecordedText(text);
      };

      recognition.onend = () => {
        setIsRecording(false);
        setStatus('recorded');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error(err);
      setIsRecording(false);
    }
  };

  const stopVoice = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsRecording(false);
      setStatus('recorded');
    }
  };

  const resetVoice = () => {
    setRecordedText('');
    setStatus('idle');
    setIsRecording(false);
  };

  const handleSendToAI = () => {
    if (recordedText.trim()) {
      navigate('/assistant', { state: { initialPrompt: recordedText } });
    }
  };

  return (
    <div className="p-6 sm:p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Prefer Speaking?</h3>
            <p className="text-xs text-slate-400">Tell us what you need using your voice</p>
          </div>
        </div>

        {/* Language selector */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-semibold text-white focus:outline-none focus:border-amber-500 cursor-pointer"
        >
          <option value="te-IN" className="bg-slate-900 text-white py-1">తెలుగు (Telugu)</option>
          <option value="hi-IN" className="bg-slate-900 text-white py-1">हिन्दी (Hindi)</option>
          <option value="en-IN" className="bg-slate-900 text-white py-1">English (India)</option>
          <option value="ta-IN" className="bg-slate-900 text-white py-1">தமிழ் (Tamil)</option>
          <option value="kn-IN" className="bg-slate-900 text-white py-1">ಕನ್ನಡ (Kannada)</option>
        </select>
      </div>

      <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
        {status === 'recording' ? (
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center mx-auto animate-pulse shadow-lg shadow-red-950/60">
              <Mic className="w-6 h-6" />
            </div>
            <p className="text-xs text-red-400 font-bold">Listening... Speak now</p>
            <button
              onClick={stopVoice}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg"
            >
              Stop Recording
            </button>
          </div>
        ) : status === 'recorded' ? (
          <div className="w-full space-y-3 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-agri-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Captured Audio Transcript:</span>
              </span>
              <button onClick={resetVoice} className="text-slate-400 hover:text-white p-1">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-200 bg-slate-900 p-3 rounded-xl border border-slate-800">
              "{recordedText || 'No clear speech detected.'}"
            </p>
            <button
              onClick={handleSendToAI}
              disabled={!recordedText.trim()}
              className="w-full py-2 bg-agri-500 hover:bg-agri-400 text-slate-950 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <span>Ask AgriQura AI with this Voice Query</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={startVoice}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 hover:scale-105 flex items-center justify-center mx-auto shadow-lg shadow-amber-950/40 transition-transform"
            >
              <Mic className="w-6 h-6" />
            </button>
            <p className="text-xs text-slate-300">Tap microphone to speak your question in {language.split('-')[0]}</p>
          </div>
        )}
      </div>
    </div>
  );
}
