const env = require('../config/env');
const { getGroqClient } = require('../services/groqClient');

/**
 * Map standard app locale to Sarvam AI language codes
 */
const mapLocaleToSarvam = (lang = 'en-IN') => {
  const langLower = (lang || 'en-IN').toLowerCase();
  if (langLower.startsWith('te')) return 'te-IN';
  if (langLower.startsWith('hi')) return 'hi-IN';
  if (langLower.startsWith('ta')) return 'ta-IN';
  if (langLower.startsWith('kn')) return 'kn-IN';
  if (langLower.startsWith('ml')) return 'ml-IN';
  if (langLower.startsWith('mr')) return 'mr-IN';
  if (langLower.startsWith('bn')) return 'bn-IN';
  if (langLower.startsWith('gu')) return 'gu-IN';
  if (langLower.startsWith('pa')) return 'pa-IN';
  if (langLower.startsWith('raj')) return 'hi-IN'; // Sarvam uses hi-IN fallback for Rajasthani
  return 'en-IN';
};

/**
 * Synthesize TTS with Sarvam AI
 */
const synthesizeSarvam = async (text, language) => {
  if (!env.sarvamApiKey) {
    throw new Error('SARVAM_API_KEY is not configured');
  }

  const sarvamLang = mapLocaleToSarvam(language);
  const truncatedText = text.length > 500 ? text.substring(0, 497) + '...' : text;
  
  const response = await fetch('https://api.sarvam.ai/text-to-speech', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-subscription-key': env.sarvamApiKey,
    },
    body: JSON.stringify({
      inputs: [truncatedText],
      target_language_code: sarvamLang,
      speaker: env.sarvamSpeaker || 'priya',
      pace: 1.0,
      speech_sample_rate: 8000,
      enable_preprocessing: true,
      model: 'bulbul:v3',
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Sarvam TTS error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const base64Audio = data.audios?.[0];
  if (!base64Audio) {
    throw new Error('Sarvam returned empty audio data');
  }

  return {
    provider: 'sarvam',
    audioData: base64Audio,
    mimeType: 'audio/wav',
    language: sarvamLang,
  };
};

/**
 * Synthesize TTS with ElevenLabs
 */
const synthesizeElevenLabs = async (text) => {
  if (!env.elevenlabsApiKey) {
    throw new Error('ELEVENLABS_API_KEY is not configured');
  }

  const voiceId = env.elevenlabsVoiceId || '21m00Tcm4TlvDq8ikWAM';
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': env.elevenlabsApiKey,
      'Accept': 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`ElevenLabs TTS error (${response.status}): ${errText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const base64Audio = Buffer.from(arrayBuffer).toString('base64');

  return {
    provider: 'elevenlabs',
    audioData: base64Audio,
    mimeType: 'audio/mpeg',
  };
};

/**
 * POST /api/voice/tts
 * Unified TTS Endpoint executing Sarvam AI -> ElevenLabs -> Client Browser Fallback chain
 */
exports.synthesizeSpeech = async (req, res) => {
  const { text, language = 'en-IN' } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ success: false, error: 'Text is required for TTS synthesis' });
  }

  const cleanText = text.replace(/[*#_`]/g, '').trim();

  // Tier 1: Attempt Sarvam AI
  try {
    const result = await synthesizeSarvam(cleanText, language);
    return res.status(200).json({
      success: true,
      provider: 'sarvam',
      audioData: result.audioData,
      mimeType: result.mimeType,
      language: result.language,
    });
  } catch (sarvamErr) {
    console.warn('⚠️ [TTS Fallback] Sarvam AI unavailable:', sarvamErr.message);
  }

  // Tier 2: Attempt ElevenLabs
  try {
    const result = await synthesizeElevenLabs(cleanText);
    return res.status(200).json({
      success: true,
      provider: 'elevenlabs',
      audioData: result.audioData,
      mimeType: result.mimeType,
    });
  } catch (elevenErr) {
    console.warn('⚠️ [TTS Fallback] ElevenLabs unavailable:', elevenErr.message);
  }

  // Tier 3: Return graceful signal for frontend Web SpeechSynthesis (Edge/Browser)
  return res.status(200).json({
    success: true,
    provider: 'edge',
    fallbackToBrowser: true,
    text: cleanText,
    language,
    message: 'Using browser neural speech synthesis fallback.',
  });
};

/**
 * POST /api/voice/intent
 * Groq Llama-3 AI Intent Extraction for complex or open-ended voice queries
 */
exports.extractIntent = async (req, res) => {
  try {
    const { transcript, language = 'en', currentRoute = '/' } = req.body;

    if (!transcript || !transcript.trim()) {
      return res.status(400).json({ success: false, error: 'Transcript is required' });
    }

    const groq = getGroqClient();

    if (!env.groqApiKey) {
      return res.status(200).json({
        success: true,
        intent: 'START_CHAT',
        entities: {},
        suggestedAction: {
          type: 'NAVIGATE',
          route: '/assistant',
          params: { query: transcript },
        },
        spokenResponse: 'Opening AI Farm Chatbot.',
      });
    }

    const prompt = `You are the intent recognition engine for AgriQura, an agricultural intelligence platform for Indian farmers.
Given the user's spoken voice command, extract the intent and entities.

SUPPORTED INTENTS:
- OPEN_DASHBOARD (Route: /dashboard)
- OPEN_AI_CHATBOT (Route: /assistant)
- OPEN_CROP_DIAGNOSIS (Route: /disease)
- OPEN_WEATHER (Route: /weather)
- OPEN_MARKET_PRICES (Route: /market)
- OPEN_GOVERNMENT_SCHEMES (Route: /schemes)
- OPEN_SOIL_HEALTH (Route: /soil)
- OPEN_MY_FARM (Route: /my-farm)
- OPEN_PROFILE (Route: /profile)
- OPEN_CONTACT (Route: /contact)
- OPEN_HELP_DESK (Route: /help-desk)
- CHECK_MARKET_PRICE (Route: /market with crop entity)
- SEARCH_SCHEME (Route: /schemes with search query)
- START_CHAT (Route: /assistant with question)
- GO_HOME (Route: /)
- GO_BACK
- STOP
- CANCEL

USER CONTEXT:
- Current Route: ${currentRoute}
- User Language: ${language}
- User Voice Transcript: "${transcript}"

OUTPUT STRICT JSON ONLY with format:
{
  "intent": "INTENT_NAME",
  "entities": {
    "crop": "crop name if mentioned, else null",
    "scheme": "scheme name if mentioned, else null",
    "district": "district if mentioned, else null"
  },
  "suggestedAction": {
    "type": "NAVIGATE | FILTER | CHAT_HANDOFF | BACK | STOP",
    "route": "/route-path",
    "params": {}
  },
  "spokenResponse": "Short 1-sentence confirmation in the user's language (e.g., 'Opening weather.' or 'Opening market prices for tomato.')"
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a strict JSON intent parser for AgriQura. Output valid JSON only, no explanation.' },
        { role: 'user', content: prompt },
      ],
      model: env.groqFastModel || 'llama-3.1-8b-instant',
      temperature: 0.1,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);

    return res.status(200).json({
      success: true,
      ...parsed,
    });
  } catch (error) {
    console.error('❌ [Voice Intent Extraction Error]:', error.message);
    return res.status(200).json({
      success: true,
      intent: 'START_CHAT',
      entities: {},
      suggestedAction: {
        type: 'NAVIGATE',
        route: '/assistant',
        params: { query: req.body.transcript },
      },
      spokenResponse: 'Opening AI Farm Chatbot.',
    });
  }
};
