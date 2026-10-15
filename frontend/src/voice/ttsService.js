/**
 * AgriQura Global TTS Service
 * Executes strict fallback order: Sarvam AI -> ElevenLabs -> Edge/Browser Web SpeechSynthesis.
 * Completely centralized, zero secret keys exposed on frontend.
 * Provides onBoundary and onProgress callbacks for real-time word synchronization.
 */

let activeAudio = null;
let activeUtterance = null;
let lastProvider = 'none';

/**
 * Get the current active provider used for the last speech synthesis
 */
export function getLastTTSProvider() {
  return lastProvider;
}

/**
 * Stop any currently playing audio or speech synthesis
 */
export function stopSpeaking() {
  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.currentTime = 0;
      activeAudio = null;
    } catch (e) {
      // Ignore
    }
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      // Ignore
    }
  }
}

/**
 * Synthesize speech in the browser via SpeechSynthesisUtterance (Tier 3 fallback)
 */
function speakBrowserSpeech(cleanText, language, options = {}) {
  const { onStart, onEnd, onBoundary } = options;

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language || 'en-IN';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      lastProvider = 'edge';
      if (onStart) onStart({ provider: 'edge' });
    };

    utterance.onboundary = (event) => {
      if (onBoundary) {
        onBoundary({
          charIndex: event.charIndex !== undefined ? event.charIndex : 0,
          charLength: event.charLength || 1,
          name: event.name,
          elapsedTime: event.elapsedTime,
        });
      }
    };

    utterance.onend = () => {
      activeUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      activeUtterance = null;
      if (onEnd) onEnd();
    };

    activeUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('⚠️ [Browser TTS Error]:', err);
    if (onEnd) onEnd();
  }
}

/**
 * Main TTS speak entry point
 * @param {string} text - The text to speak
 * @param {string} language - Locale (e.g. 'te-IN', 'hi-IN', 'en-IN')
 * @param {object} options - Callbacks { onStart, onEnd, onBoundary, onProviderChange }
 */
export async function speak(text, language = 'en-IN', options = {}) {
  const { onStart, onEnd, onBoundary, onProviderChange } = options;

  if (!text || !text.trim()) {
    if (onEnd) onEnd();
    return;
  }

  stopSpeaking();

  const cleanText = text.replace(/[*#_`]/g, '').trim();

  try {
    // Attempt backend synthesis (Sarvam AI -> ElevenLabs)
    const backendUrl = 'http://localhost:5000/api/voice/tts';
    const res = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: cleanText,
        language,
      }),
    });

    if (res.ok) {
      const data = await res.json();

      if (data.success && data.audioData) {
        // High quality neural audio returned from Sarvam or ElevenLabs
        const audioSrc = `data:${data.mimeType || 'audio/wav'};base64,${data.audioData}`;
        const audio = new Audio(audioSrc);
        activeAudio = audio;
        lastProvider = data.provider || 'sarvam';

        if (onProviderChange) onProviderChange(lastProvider);
        if (onStart) onStart({ provider: lastProvider });

        audio.ontimeupdate = () => {
          if (audio.duration && onBoundary) {
            const ratio = Math.min(1, Math.max(0, audio.currentTime / audio.duration));
            const charIndex = Math.floor(ratio * cleanText.length);
            onBoundary({
              charIndex,
              ratio,
            });
          }
        };

        audio.onended = () => {
          activeAudio = null;
          if (onEnd) onEnd();
        };

        audio.onerror = () => {
          console.warn(`⚠️ [${data.provider} Audio Playback Error], falling back to Browser TTS`);
          speakBrowserSpeech(cleanText, language, options);
        };

        await audio.play();
        return;
      }
    }
  } catch (backendErr) {
    console.warn('⚠️ [Backend TTS Request Failed], proceeding to Browser SpeechSynthesis:', backendErr.message);
  }

  // Tier 3 Fallback: Native Browser / Edge Speech Synthesis
  lastProvider = 'edge';
  if (onProviderChange) onProviderChange('edge');
  speakBrowserSpeech(cleanText, language, options);
}
