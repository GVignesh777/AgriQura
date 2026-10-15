import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Globe,
  Loader2,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function VoiceHelp({ initialLanguage = 'en' }) {
  const [selectedLang, setSelectedLang] = useState(
    initialLanguage === 'te' ? 'te-IN' : initialLanguage === 'hi' ? 'hi-IN' : 'en-IN'
  );
  const [recordingState, setRecordingState] = useState('idle'); // 'idle' | 'recording' | 'processing' | 'result'
  const [transcript, setTranscript] = useState('');
  const [voiceResponse, setVoiceResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  const isSpeechSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const langOptions = [
    { code: 'te-IN', label: 'తెలుగు (Telugu)' },
    { code: 'hi-IN', label: 'हिंदी (Hindi)' },
    { code: 'en-IN', label: 'English' },
  ];

  // Stop synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleStartListening = () => {
    setErrorMessage('');
    if (!isSpeechSupported) {
      setErrorMessage(
        'Speech recognition is not supported in this browser. Please use Google Chrome or type your question.'
      );
      return;
    }

    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.lang = selectedLang;
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onstart = () => {
        setRecordingState('recording');
        setTranscript('');
      };

      recognition.onresult = (event) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);
      };

      recognition.onerror = (event) => {
        console.warn('Speech error:', event.error);
        if (event.error !== 'no-speech') {
          setErrorMessage(`Audio capture error: ${event.error}. Please try again.`);
        }
        setRecordingState('idle');
      };

      recognition.onend = () => {
        if (transcript.trim()) {
          processVoiceQuery(transcript);
        } else {
          setRecordingState('idle');
        }
      };

      recognition.start();
    } catch (err) {
      setErrorMessage('Failed to access microphone. Please verify browser permissions.');
      setRecordingState('idle');
    }
  };

  const handleStopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (transcript.trim()) {
      processVoiceQuery(transcript);
    } else {
      setRecordingState('idle');
    }
  };

  const processVoiceQuery = (query) => {
    setRecordingState('processing');

    setTimeout(() => {
      let answerText = '';
      if (selectedLang.startsWith('te')) {
        answerText =
          'నమస్కారం! మీ పంటకు సంబంధించి తెగుళ్లు లేదా ఎరువుల సమాచారం కోసం AI అసిస్టెంట్‌తో మాట్లాడండి. ప్రస్తుత వాతావరణం అనుకూలంగా ఉంది.';
      } else if (selectedLang.startsWith('hi')) {
        answerText =
          'नमस्ते किसान साथी! आपकी फसल के लिए कीट नियंत्रण और मौसम सलाह तैयार है। कृपया विस्तृत जानकारी के लिए AI से जुड़ें।';
      } else {
        answerText =
          'Hello Farmer! Based on your query, ensure adequate soil moisture and monitor for leaf spot symptoms before applying nitrogen fertilizers.';
      }

      setVoiceResponse(answerText);
      setRecordingState('result');
      speakAnswer(answerText);
    }, 1200);
  };

  const speakAnswer = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLang;
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else if (voiceResponse) {
      speakAnswer(voiceResponse);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-agri-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Mic className="w-4 h-4 text-emerald-400" />
              <span>Voice Interaction Center</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Speak Your Problem
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Ask AgriQura naturally in your regional language without typing.
            </p>
          </div>

          {/* Language Selector Segmented Control */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 p-1 rounded-2xl">
            {langOptions.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setSelectedLang(lang.code);
                  setRecordingState('idle');
                  setTranscript('');
                  setVoiceResponse('');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  selectedLang === lang.code
                    ? 'bg-agri-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Core Voice Action Area */}
        <div className="py-8 flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-6">
          {/* Main State-Driven Visual Button */}
          <div className="relative flex items-center justify-center">
            {/* Waveform Ring when recording */}
            {recordingState === 'recording' && (
              <div className="absolute w-36 h-36 rounded-full bg-agri-500/20 animate-ping opacity-75 pointer-events-none" />
            )}

            <button
              onClick={
                recordingState === 'recording'
                  ? handleStopListening
                  : handleStartListening
              }
              disabled={recordingState === 'processing'}
              className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl relative z-10 ${
                recordingState === 'recording'
                  ? 'bg-red-600 hover:bg-red-700 text-white ring-4 ring-red-500/40 scale-105'
                  : recordingState === 'processing'
                  ? 'bg-amber-600 text-white opacity-80 cursor-wait'
                  : 'bg-gradient-to-br from-agri-500 via-emerald-600 to-teal-700 hover:scale-105 text-white ring-4 ring-agri-500/20 hover:ring-agri-500/40'
              }`}
              aria-label={
                recordingState === 'recording'
                  ? 'Stop Voice Recording'
                  : 'Start Voice Problem Recording'
              }
            >
              {recordingState === 'recording' ? (
                <>
                  <MicOff className="w-8 h-8 sm:w-10 sm:h-10 mb-1 animate-pulse" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Stop</span>
                </>
              ) : recordingState === 'processing' ? (
                <>
                  <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 mb-1 animate-spin" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Thinking</span>
                </>
              ) : (
                <>
                  <Mic className="w-8 h-8 sm:w-10 sm:h-10 mb-1" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Tap to Speak</span>
                </>
              )}
            </button>
          </div>

          {/* Status Text / Waveform Visual */}
          <div className="space-y-2">
            {recordingState === 'recording' ? (
              <div className="space-y-1">
                <p className="text-sm font-semibold text-agri-400 flex items-center justify-center gap-1.5 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Listening in {langOptions.find((l) => l.code === selectedLang)?.label}...
                </p>
                <p className="text-xs text-slate-400">
                  {transcript || 'Speak clearly about your crop, disease, or market inquiry.'}
                </p>
              </div>
            ) : recordingState === 'processing' ? (
              <p className="text-sm font-semibold text-amber-400">
                Processing your voice query with AgriQura AI...
              </p>
            ) : recordingState === 'result' ? (
              <div className="space-y-3 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-left w-full">
                {transcript && (
                  <div className="text-xs text-slate-400 border-b border-slate-800 pb-2">
                    <span className="font-semibold text-slate-300">You asked: </span>
                    "{transcript}"
                  </div>
                )}
                <div className="text-sm text-slate-200 leading-relaxed font-medium">
                  {voiceResponse}
                </div>
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={toggleSpeech}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-200 transition-colors"
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-red-400" />
                        <span>Mute Audio</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Listen Again</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => navigate('/assistant')}
                    className="text-xs text-agri-400 hover:text-agri-300 font-semibold flex items-center gap-1"
                  >
                    <span>Open AI Assistant & Voice Chat</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-slate-400">
                Tap the microphone button, ask your farming problem, and get a spoken advisory response.
              </p>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="flex items-center justify-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl mt-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
