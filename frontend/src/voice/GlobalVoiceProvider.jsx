/**
 * AgriQura Global Voice Intelligence Provider
 * Root-mounted context coordinating wake word engine, speech recognition,
 * intent resolution, context routing, and multi-tier TTS playback.
 */

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { wakeWordEngine } from './wakeWordEngine';
import { speechRecognitionService, getSpeechLocale } from './speechRecognition';
import { resolveIntent } from './intentEngine';
import { executeCommand } from './commandRouter';
import { speak, stopSpeaking } from './ttsService';

export const VOICE_STATES = {
  DISABLED: 'DISABLED',
  IDLE: 'IDLE',
  WAKE_WORD_DETECTED: 'WAKE_WORD_DETECTED',
  LISTENING: 'LISTENING',
  PROCESSING: 'PROCESSING',
  EXECUTING: 'EXECUTING',
  SPEAKING: 'SPEAKING',
  ERROR: 'ERROR',
};

const GlobalVoiceContext = createContext(null);

export const GlobalVoiceProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();

  // Voice States - Enabled by default unless explicitly disabled
  const [isEnabled, setIsEnabled] = useState(() => {
    const saved = localStorage.getItem('agriqura_voice_enabled');
    return saved !== 'false';
  });

  const [voiceState, setVoiceState] = useState(() =>
    isEnabled ? VOICE_STATES.IDLE : VOICE_STATES.DISABLED
  );
  const [transcript, setTranscript] = useState('');
  const [lastResponse, setLastResponse] = useState('');
  const [lastIntent, setLastIntent] = useState('');
  const [activeProvider, setActiveProvider] = useState('none');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDebugOpen, setIsDebugOpen] = useState(false);

  // Keep live refs to avoid stale closures
  const stateRef = useRef(voiceState);
  stateRef.current = voiceState;
  const isEnabledRef = useRef(isEnabled);
  isEnabledRef.current = isEnabled;

  const currentLocale = getSpeechLocale(i18n.language || 'en');

  // Handle Intent & Command execution pipeline
  const handleProcessSpokenCommand = useCallback(
    async (spokenText) => {
      const cleanText = (spokenText || '').trim();

      if (!cleanText) {
        setVoiceState(VOICE_STATES.IDLE);
        wakeWordEngine.resume();
        return;
      }

      setTranscript(cleanText);
      setVoiceState(VOICE_STATES.PROCESSING);

      try {
        const resolved = await resolveIntent(cleanText, currentLocale, location.pathname);
        setLastIntent(resolved.intent);

        setVoiceState(VOICE_STATES.EXECUTING);
        const executionResult = await executeCommand(resolved, { navigate, location });

        const responseToSpeak = executionResult.spokenResponse || resolved.spokenResponse;
        setLastResponse(responseToSpeak);

        if (responseToSpeak && resolved.intent !== 'STOP') {
          setVoiceState(VOICE_STATES.SPEAKING);
          await speak(responseToSpeak, currentLocale, {
            onProviderChange: (p) => setActiveProvider(p),
            onEnd: () => {
              if (isEnabledRef.current) {
                setVoiceState(VOICE_STATES.IDLE);
                wakeWordEngine.resume();
              }
            },
          });
        } else {
          setVoiceState(VOICE_STATES.IDLE);
          wakeWordEngine.resume();
        }
      } catch (err) {
        console.error('❌ [Voice Command Execution Error]:', err);
        setErrorMessage('Sorry, could not process that command.');
        setVoiceState(VOICE_STATES.ERROR);
        setTimeout(() => {
          if (isEnabledRef.current) {
            setVoiceState(VOICE_STATES.IDLE);
            wakeWordEngine.resume();
          }
        }, 2000);
      }
    },
    [currentLocale, location, navigate]
  );

  // Activate command listening after wake word detected or manual button trigger
  const startCommandListening = useCallback(() => {
    wakeWordEngine.pause();
    setVoiceState(VOICE_STATES.LISTENING);
    setTranscript('');

    speechRecognitionService.start({
      language: currentLocale,
      onStart: () => {
        setVoiceState(VOICE_STATES.LISTENING);
      },
      onResult: ({ transcript: activeText }) => {
        setTranscript(activeText);
      },
      onEnd: (finalText) => {
        handleProcessSpokenCommand(finalText);
      },
      onError: (err) => {
        if (err !== 'no-speech' && err !== 'aborted') {
          setErrorMessage('Voice recognition error. Please try again.');
          setVoiceState(VOICE_STATES.ERROR);
          setTimeout(() => {
            if (isEnabledRef.current) {
              setVoiceState(VOICE_STATES.IDLE);
              wakeWordEngine.resume();
            }
          }, 2000);
        } else {
          setVoiceState(VOICE_STATES.IDLE);
          wakeWordEngine.resume();
        }
      },
    });
  }, [currentLocale, handleProcessSpokenCommand]);

  // Enable Voice Assistant & Start Wake Word Engine
  const enableQura = useCallback(async () => {
    try {
      setIsEnabled(true);
      localStorage.setItem('agriqura_voice_enabled', 'true');
      setVoiceState(VOICE_STATES.IDLE);
      setErrorMessage('');

      // Warm up microphone permission if needed
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          // Release initial test stream track immediately
          stream.getTracks().forEach((t) => t.stop());
        } catch (permErr) {
          console.warn('Microphone permission check:', permErr);
        }
      }

      await wakeWordEngine.start({
        onWakeWord: ({ trailingCommand }) => {
          setVoiceState(VOICE_STATES.WAKE_WORD_DETECTED);

          if (trailingCommand && trailingCommand.length > 2) {
            // User spoke wake-word and command in one go (e.g. "Hey Qura open weather")
            setTimeout(() => {
              handleProcessSpokenCommand(trailingCommand);
            }, 80);
          } else {
            // User spoke only wake-word, open listening window
            setTimeout(() => {
              startCommandListening();
            }, 100);
          }
        },
        onError: (err) => {
          console.warn('⚠️ [WakeWord Error]:', err);
          setErrorMessage(err || 'Microphone error');
        },
      });
    } catch (err) {
      console.error('❌ Failed to enable Qura:', err);
      setIsEnabled(false);
      localStorage.setItem('agriqura_voice_enabled', 'false');
      setVoiceState(VOICE_STATES.DISABLED);
    }
  }, [handleProcessSpokenCommand, startCommandListening]);

  // Disable Voice Assistant & Release Audio Resources
  const disableQura = useCallback(() => {
    setIsEnabled(false);
    localStorage.setItem('agriqura_voice_enabled', 'false');
    setVoiceState(VOICE_STATES.DISABLED);
    stopSpeaking();
    speechRecognitionService.abort();
    wakeWordEngine.stop();
  }, []);

  // Manual Trigger (Tap to Speak / Alt + V)
  const triggerManualListen = useCallback(() => {
    stopSpeaking();

    if (!isEnabledRef.current) {
      enableQura().then(() => {
        startCommandListening();
      });
    } else {
      startCommandListening();
    }
  }, [enableQura, startCommandListening]);

  // Stop current action / voice playback
  const stop = useCallback(() => {
    stopSpeaking();
    speechRecognitionService.abort();
    if (isEnabledRef.current) {
      setVoiceState(VOICE_STATES.IDLE);
      wakeWordEngine.resume();
    } else {
      setVoiceState(VOICE_STATES.DISABLED);
    }
  }, []);

  // Initialize Wake Word on mount if enabled
  useEffect(() => {
    if (isEnabled) {
      enableQura();
    }

    return () => {
      stopSpeaking();
      speechRecognitionService.abort();
      wakeWordEngine.stop();
    };
  }, []);

  // Global Keyboard Shortcuts (Alt + V to speak, Esc to stop)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        triggerManualListen();
      } else if (
        e.key === 'Escape' &&
        voiceState !== VOICE_STATES.IDLE &&
        voiceState !== VOICE_STATES.DISABLED
      ) {
        e.preventDefault();
        stop();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stop, triggerManualListen, voiceState]);

  const value = {
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
    toggleDebug: () => setIsDebugOpen((prev) => !prev),
  };

  return (
    <GlobalVoiceContext.Provider value={value}>
      {children}
    </GlobalVoiceContext.Provider>
  );
};

export const useGlobalVoice = () => {
  const context = useContext(GlobalVoiceContext);
  if (!context) {
    throw new Error('useGlobalVoice must be used within a GlobalVoiceProvider');
  }
  return context;
};
