/**
 * AgriQura Local Wake Word Engine
 * Continuously listens on the client for "Hey Qura" / "Qura" / "హే కురా" / "हे कुरा" and phonetic variations.
 * Zero external audio streaming, client-side Web Speech matching.
 */

class WakeWordEngine {
  constructor() {
    this.isActive = false;
    this.isPaused = false;
    this.isStarting = false;
    this.speechRec = null;
    this.onWakeWordDetected = null;
    this.onError = null;
    this.restartTimeout = null;
    this.detectedThrottle = false;
  }

  isSupported() {
    if (typeof window === 'undefined') return false;
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }

  /**
   * Start listening for the wake word locally
   */
  async start({ onWakeWord, onError } = {}) {
    this.onWakeWordDetected = onWakeWord;
    this.onError = onError;
    this.isActive = true;
    this.isPaused = false;

    if (!this.isSupported()) {
      if (this.onError) this.onError('Speech recognition is not supported in this browser.');
      return;
    }

    this.startLocalListener();
  }

  /**
   * Sanitize text and test for all phonetic variations of "Hey Qura"
   */
  checkWakeWord(rawTranscript) {
    if (!rawTranscript || typeof rawTranscript !== 'string') {
      return { matched: false, trailingCommand: null };
    }

    // 1. Strip all punctuation (commas, periods, exclamation marks, hyphens, quotes)
    const normalized = rawTranscript
      .toLowerCase()
      .replace(/[,.?!:;'"\-_]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // 2. Comprehensive phonetic patterns covering English & Indian English accents
    const englishWakePatterns = [
      // Matches "hey qura", "hey cura", "hey kura", "hey cure", "hey cora", "hey coura", "hey quran", "hey pura", "hey guru", "hey kooda", "hey khura", "hey qra", "hey quraa", "qura", "kura", "cura"
      /\b(hey|hay|hi|hai|hello|ok|okay|a|ay|ey|o|oye)?\s*(ra|ko|kor|kur|qura|kura|kyura|cura|kyura|cora|cure|koora|khura|pura|guru|quran|qra|kooda|qrah|quraa)\b/i,
      // Matches split syllables e.g. "hey q ra", "hey ku ra", "hey cu ra"
      /\b(hey|hay|hi|hai|hello|ok|okay|a)?\s*(ku|cu|q|kyu)\s+(ra|rah|raa|re)\b/i,
    ];

    // 3. Indic Native Script Patterns (Telugu, Hindi, Tamil, Kannada, Bengali)
    const indicWakePatterns = [
      // Telugu: హే కురా, హాయ్ కురా, కురా, కూరా, హే కూర, క్యూరా, హే క్యూరా, హే ఖురా
      /(హే|హాయ్|ఓ)?\s*(కురా|కూరా|కూర|క్యూరా|ఖురా)/,
      // Hindi: हे कुरा, हाय कुरा, कुरा, कूरा, हे क्यूरा, क्यूरा, हे खुरा, खुरा
      /(हे|हाय|ओ)?\s*(कुरा|कूरा|क्यूरा|खुरा)/,
      // Tamil & Kannada
      /(ஹே|ஹாய்)?\s*(குரா|கூரா)/,
      /(ಹೇ|ಹಾಯ್)?\s*(ಕುರಾ|ಕೂರಾ)/,
      // Bengali & others
      /(হে|হায়)?\s*(কুরা)/,
    ];

    const allPatterns = [...englishWakePatterns, ...indicWakePatterns];

    for (const pattern of allPatterns) {
      if (pattern.test(normalized)) {
        // Extract any trailing command spoken in the same breath (e.g. "Hey Qura open weather")
        const cleanCommand = normalized
          .replace(pattern, '')
          .replace(/^(please|can you|could you|tell me|show me)/i, '')
          .trim();

        return {
          matched: true,
          trailingCommand: cleanCommand || null,
        };
      }
    }

    return { matched: false, trailingCommand: null };
  }

  /**
   * Internal local listener lifecycle with automatic recovery
   */
  startLocalListener() {
    if (!this.isActive || this.isPaused || this.isStarting) return;

    // Teardown any existing instance cleanly
    if (this.speechRec) {
      try {
        this.speechRec.onresult = null;
        this.speechRec.onerror = null;
        this.speechRec.onend = null;
        this.speechRec.abort();
      } catch (e) {}
      this.speechRec = null;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) return;

      this.isStarting = true;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 3;
      recognition.lang = 'en-IN'; // Highly optimal for Indian English & bilingual voice phonetics

      recognition.onstart = () => {
        this.isStarting = false;
      };

      recognition.onresult = (event) => {
        if (!this.isActive || this.isPaused || this.detectedThrottle) return;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const resultItem = event.results[i];
          
          // Check all alternatives for maximum accuracy
          for (let j = 0; j < resultItem.length; j++) {
            const transcript = resultItem[j].transcript;
            const { matched, trailingCommand } = this.checkWakeWord(transcript);

            if (matched) {
              this.detectedThrottle = true;
              this.pause();

              setTimeout(() => {
                this.detectedThrottle = false;
              }, 1500);

              if (this.onWakeWordDetected) {
                this.onWakeWordDetected({ trailingCommand });
              }
              return;
            }
          }
        }
      };

      recognition.onerror = (e) => {
        this.isStarting = false;
        // Benign errors like 'no-speech' or 'aborted' are ignored
        if (e.error !== 'no-speech' && e.error !== 'aborted') {
          console.warn('⚠️ [WakeWord Listener Notice]:', e.error);
        }
      };

      recognition.onend = () => {
        this.isStarting = false;
        this.speechRec = null;

        // Auto-restart loop if still active and not paused
        if (this.isActive && !this.isPaused) {
          clearTimeout(this.restartTimeout);
          this.restartTimeout = setTimeout(() => {
            if (this.isActive && !this.isPaused) {
              this.startLocalListener();
            }
          }, 250);
        }
      };

      this.speechRec = recognition;
      recognition.start();
    } catch (err) {
      this.isStarting = false;
      console.warn('⚠️ [WakeWord Listener Start Exception]:', err);
      
      // Retry in 1 second if start threw
      if (this.isActive && !this.isPaused) {
        clearTimeout(this.restartTimeout);
        this.restartTimeout = setTimeout(() => {
          if (this.isActive && !this.isPaused) {
            this.startLocalListener();
          }
        }, 1000);
      }
    }
  }

  /**
   * Pause wake-word listening while active command listening / TTS is running
   */
  pause() {
    this.isPaused = true;
    this.isStarting = false;
    clearTimeout(this.restartTimeout);

    if (this.speechRec) {
      try {
        this.speechRec.onresult = null;
        this.speechRec.onerror = null;
        this.speechRec.onend = null;
        this.speechRec.abort();
      } catch (e) {}
      this.speechRec = null;
    }
  }

  /**
   * Resume wake-word listening when returning to IDLE
   */
  resume() {
    if (!this.isActive) return;
    this.isPaused = false;
    clearTimeout(this.restartTimeout);

    this.restartTimeout = setTimeout(() => {
      if (this.isActive && !this.isPaused) {
        this.startLocalListener();
      }
    }, 350);
  }

  /**
   * Stop completely and release all audio resources
   */
  stop() {
    this.isActive = false;
    this.isPaused = true;
    this.isStarting = false;
    clearTimeout(this.restartTimeout);

    if (this.speechRec) {
      try {
        this.speechRec.onresult = null;
        this.speechRec.onerror = null;
        this.speechRec.onend = null;
        this.speechRec.abort();
      } catch (e) {}
      this.speechRec = null;
    }
  }
}

export const wakeWordEngine = new WakeWordEngine();
