import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  X,
  Sparkles,
  Globe,
  Search,
  CheckCircle2,
  Volume2
} from 'lucide-react';

export default function VoiceSchemeSearch({
  isOpen,
  onClose,
  onApplyVoiceQuery
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [selectedLang, setSelectedLang] = useState('en-IN');
  const [statusMessage, setStatusMessage] = useState('Tap microphone to start speaking...');
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      startListening();
    } else {
      stopListening();
      setTranscript('');
    }
    return () => stopListening();
  }, [isOpen, selectedLang]);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatusMessage('Voice recognition not supported in this browser. Please type query below.');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.lang = selectedLang;
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsRecording(true);
        setStatusMessage('Listening... Speak your crop, state, or scheme need clearly.');
      };

      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
      };

      recognition.onerror = (event) => {
        console.warn('Voice error:', event.error);
        setIsRecording(false);
        setStatusMessage('Could not capture audio. Please try speaking again.');
      };

      recognition.onend = () => {
        setIsRecording(false);
        setStatusMessage('Audio recorded. Click Search Schemes to proceed.');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error(err);
      setIsRecording(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      setIsRecording(false);
    }
  };

  if (!isOpen) return null;

  const handleSearch = () => {
    if (transcript.trim()) {
      onApplyVoiceQuery(transcript);
      onClose();
    }
  };

  const sampleQueries = [
    'I need irrigation subsidy for cotton in Telangana',
    'Crop insurance for rice in Andhra Pradesh',
    'PM KISAN installment scheme',
    'Solar water pump subsidy'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-6 animate-scale-up">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Voice Scheme Search</h3>
              <p className="text-[10px] text-slate-400">Speak naturally in your language</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Language Switch */}
        <div className="flex items-center justify-between p-2 bg-slate-850 rounded-xl text-xs">
          <span className="text-slate-400 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-agri-400" /> Language:
          </span>
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded-lg focus:outline-none"
          >
            <option value="en-IN">English (India)</option>
            <option value="te-IN">తెలుగు (Telugu)</option>
            <option value="hi-IN">हिन्दी (Hindi)</option>
            <option value="ta-IN">தமிழ் (Tamil)</option>
            <option value="kn-IN">ಕನ್ನಡ (Kannada)</option>
            <option value="mr-IN">मराठी (Marathi)</option>
            <option value="bn-IN">বাংলা (Bengali)</option>
            <option value="gu-IN">ગુજરાતી (Gujarati)</option>
            <option value="pa-IN">ਪੰਜਾਬੀ (Punjabi)</option>
          </select>
        </div>

        {/* Animated Microphone Area */}
        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          <div className="relative">
            {isRecording && (
              <div className="absolute inset-0 rounded-full bg-amber-500/30 animate-ping" />
            )}
            <button
              onClick={isRecording ? stopListening : startListening}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all ${
                isRecording
                  ? 'bg-red-500 text-white hover:bg-red-600 scale-105'
                  : 'bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 hover:scale-105'
              }`}
            >
              {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>
          </div>

          <p className="text-xs text-center text-slate-300 font-medium px-4">
            {statusMessage}
          </p>
        </div>

        {/* Captured Transcript Preview */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Detected Query:
          </label>
          <input
            type="text"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Your voice query appears here..."
            className="w-full px-3.5 py-2.5 bg-slate-850 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Quick Sample Queries */}
        <div className="space-y-1.5">
          <p className="text-[10px] text-slate-400 font-semibold uppercase">Or click an example:</p>
          <div className="flex flex-wrap gap-1.5">
            {sampleQueries.map((sq, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTranscript(sq);
                  onApplyVoiceQuery(sq);
                  onClose();
                }}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg text-[11px] text-slate-300 hover:text-white transition-colors"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSearch}
          disabled={!transcript.trim()}
          className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40"
        >
          <Search className="w-4 h-4" />
          <span>Search Matching Schemes</span>
        </button>

      </div>
    </div>
  );
}
