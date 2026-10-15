/**
 * AgriQura Multilingual Speech Recognition Service
 * Robust Web Speech API implementation with continuous audio capture,
 * cross-instance isolation, clean hardware release, and intelligent silence detection.
 */

import { wakeWordEngine } from './wakeWordEngine';

// Supported locale mapping
export const LOCALE_MAP = {
  en: 'en-IN',
  te: 'te-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
  kn: 'kn-IN',
  ta: 'ta-IN',
  or: 'or-IN',
  ml: 'ml-IN',
  bn: 'bn-IN',
  pa: 'pa-IN',
  gu: 'gu-IN',
  raj: 'hi-IN',
  as: 'as-IN',
};

export const getSpeechLocale = (langCode = 'en') => {
  const code = (langCode || 'en').toLowerCase();
  for (const [key, locale] of Object.entries(LOCALE_MAP)) {
    if (code === key || code.startsWith(key)) return locale;
  }
  return 'en-IN';
};

class SpeechRecognitionService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.isExplicitStop = false;
    this.currentLanguage = 'en-IN';
    this.silenceTimer = null;
    this.keepAliveTimer = null;
    this.onResultCallback = null;
    this.onEndCallback = null;
    this.onErrorCallback = null;
    this.onStartCallback = null;
    this.lastActiveText = '';
    this.hasReceivedSpeech = false;
    this.startTime = 0;
  }

  isSupported() {
    if (typeof window === 'undefined') return false;
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }

  /**
   * Reset silence timer.
   * If speech has already started: 2.2s pause triggers completion.
   * If waiting for speech to begin: keep mic open for at least 8.0s.
   */
  resetSilenceTimer() {
    this.clearSilenceTimer();
    if (!this.isListening) return;

    if (this.hasReceivedSpeech) {
      this.silenceTimer = setTimeout(() => {
        if (this.isListening) {
          this.stop();
        }
      }, 2200);
    } else {
      this.silenceTimer = setTimeout(() => {
        if (this.isListening && !this.hasReceivedSpeech) {
          this.stop();
        }
      }, 8000);
    }
  }

  clearSilenceTimer() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
    if (this.keepAliveTimer) {
      clearTimeout(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
  }

  /**
   * Start a dedicated speech recognition session
   */
  async start({ language = 'en-IN', onStart, onResult, onEnd, onError } = {}) {
    if (!this.isSupported()) {
      if (onError) onError('Speech recognition is not supported in this browser.');
      return;
    }

    // 1. Pause background wake word listener to free microphone hardware
    wakeWordEngine.pause();

    // 2. Abort previous session cleanly if still active
    this.abort();

    // 3. Keep wake word engine strictly paused
    wakeWordEngine.pause();

    // 4. Allow 180ms grace period for browser/OS audio driver detachment
    await new Promise((resolve) => setTimeout(resolve, 180));

    this.isListening = true;
    this.isExplicitStop = false;
    this.onStartCallback = onStart;
    this.onResultCallback = onResult;
    this.onEndCallback = onEnd;
    this.onErrorCallback = onError;
    this.currentLanguage = language;
    this.lastActiveText = '';
    this.hasReceivedSpeech = false;
    this.startTime = Date.now();

    this.spawnRecognitionInstance();
  }

  spawnRecognitionInstance() {
    if (!this.isListening || this.isExplicitStop) return;

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const instance = new SpeechRecognition();
      instance.continuous = true;
      instance.interimResults = true;
      instance.maxAlternatives = 1;
      instance.lang = this.currentLanguage;

      instance.onstart = () => {
        if (!this.isListening) return;
        this.resetSilenceTimer();
        if (this.onStartCallback) {
          this.onStartCallback();
          this.onStartCallback = null;
        }
      };

      instance.onresult = (event) => {
        if (!this.isListening) return;

        let totalText = '';
        for (let i = 0; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item && item[0] && item[0].transcript) {
            totalText += item[0].transcript + ' ';
          }
        }

        const trimmed = totalText.trim();
        if (trimmed) {
          this.lastActiveText = trimmed;
          this.hasReceivedSpeech = true;
          this.resetSilenceTimer();

          if (this.onResultCallback) {
            this.onResultCallback({
              transcript: trimmed,
              isFinal: false,
            });
          }
        }
      };

      instance.onerror = (event) => {
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          console.warn('⚠️ [SpeechRecognition Warning]:', event.error);
          if (this.onErrorCallback) {
            this.onErrorCallback(event.error);
          }
        }
      };

      instance.onend = () => {
        // If Chrome fired onend prematurely before speech was received:
        // Automatically restart if within initial 8s window
        const elapsed = Date.now() - this.startTime;
        const shouldKeepAlive = this.isListening && !this.isExplicitStop && (!this.hasReceivedSpeech && elapsed < 8000);

        if (shouldKeepAlive) {
          this.keepAliveTimer = setTimeout(() => {
            if (this.isListening && !this.isExplicitStop) {
              this.spawnRecognitionInstance();
            }
          }, 150);
          return;
        }

        this.clearSilenceTimer();
        const finalResult = (this.lastActiveText || '').trim();
        this.isListening = false;
        this.recognition = null;

        // Resume wake word engine when speech recognition completes
        wakeWordEngine.resume();

        if (this.onEndCallback) {
          const callback = this.onEndCallback;
          this.onEndCallback = null;
          callback(finalResult);
        }
      };

      this.recognition = instance;
      instance.start();
    } catch (e) {
      console.warn('⚠️ Speech recognition spawn error:', e);
      if (this.onErrorCallback) this.onErrorCallback(e.message);
    }
  }

  stop() {
    this.isExplicitStop = true;
    this.clearSilenceTimer();
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignore
      }
    }
  }

  abort() {
    this.isExplicitStop = true;
    this.clearSilenceTimer();
    if (this.recognition) {
      try {
        this.recognition.onstart = null;
        this.recognition.onresult = null;
        this.recognition.onerror = null;
        this.recognition.onend = null;
        this.recognition.abort();
      } catch (e) {
        // Ignore
      }
      this.recognition = null;
    }
    this.isListening = false;
  }
}

export const speechRecognitionService = new SpeechRecognitionService();
