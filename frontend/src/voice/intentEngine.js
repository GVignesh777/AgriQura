/**
 * AgriQura Intent & Entity Extraction Engine
 * Priority: Local dictionary & pattern matching (0ms latency) -> Backend Groq AI Fallback
 */

import {
  COMMAND_REGISTRY,
  INTENTS,
  extractCropEntity,
  extractSchemeQuery,
} from './voiceCommandRegistry';

/**
 * Match intent locally using regex patterns and keywords
 */
function matchLocalIntent(transcript, language = 'en') {
  if (!transcript || !transcript.trim()) return null;

  const text = transcript.trim();
  const langKey = language.startsWith('te') ? 'te' : language.startsWith('hi') ? 'hi' : 'en';

  // 1. Check for explicit crop inquiry on Market
  const crop = extractCropEntity(text);
  if (crop && (text.includes('price') || text.includes('rate') || text.includes('ధర') || text.includes('भाव') || text.includes('mandi'))) {
    return {
      intent: INTENTS.CHECK_MARKET_PRICE,
      targetRoute: `/market?crop=${encodeURIComponent(crop)}`,
      entities: { crop },
      spokenResponses: {
        en: `Showing market prices for ${crop}.`,
        te: `${crop} మార్కెట్ ధరలను చూపిస్తున్నాను.`,
        hi: `${crop} के मंडी भाव दिखा रहा हूँ।`,
      },
    };
  }

  // 2. Check for explicit scheme inquiry
  const scheme = extractSchemeQuery(text);
  if (scheme) {
    return {
      intent: INTENTS.SEARCH_SCHEME,
      targetRoute: `/schemes?search=${encodeURIComponent(scheme)}`,
      entities: { scheme },
      spokenResponses: {
        en: `Searching government scheme ${scheme}.`,
        te: `${scheme} పథకం వివరాలను చూపిస్తున్నాను.`,
        hi: `${scheme} योजना की जानकारी खोज रहा हूँ।`,
      },
    };
  }

  // 3. Check for direct chat question handoff: "Ask the AI chatbot why..." or "Tell me why..."
  const isQuestionHandoff =
    /^(ask (the )?ai|ask (the )?chatbot|tell me|explain|why|how to|what is|how do i)/i.test(text) ||
    /^(అడుగు|చెప్పు|ఎందుకు|ఎలా)/i.test(text) ||
    /^(पूछो|बताओ|क्यों|कैसे)/i.test(text);

  if (isQuestionHandoff) {
    return {
      intent: INTENTS.START_CHAT,
      targetRoute: '/assistant',
      entities: { query: text },
      spokenResponses: {
        en: 'Asking AI Farm Chatbot.',
        te: 'ఏఐ ఫార్మ్ చాట్‌బాట్‌ను అడుగుతున్నాను.',
        hi: 'एआई चैटबॉट से पूछ रहा हूँ।',
      },
    };
  }

  // 4. Iterate through registered commands
  for (const cmd of COMMAND_REGISTRY) {
    for (const pattern of cmd.patterns) {
      if (pattern.test(text)) {
        return {
          intent: cmd.intent,
          targetRoute: cmd.targetRoute,
          action: cmd.action,
          entities: {
            crop: extractCropEntity(text),
            scheme: extractSchemeQuery(text),
          },
          spokenResponses: cmd.spokenResponses,
        };
      }
    }
  }

  return null;
}

/**
 * Fallback to Backend Groq AI Intent Parser for open-ended queries
 */
async function matchAIIntent(transcript, language = 'en', currentRoute = '/') {
  try {
    const res = await fetch('http://localhost:5000/api/voice/intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transcript,
        language,
        currentRoute,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        return {
          intent: data.intent || INTENTS.START_CHAT,
          targetRoute: data.suggestedAction?.route || '/assistant',
          action: data.suggestedAction?.type,
          entities: data.entities || {},
          spokenResponse: data.spokenResponse || 'Processing your request.',
        };
      }
    }
  } catch (err) {
    console.warn('⚠️ [AI Intent Parser Error]:', err.message);
  }

  // Graceful fallback to opening AI Assistant with the spoken query
  return {
    intent: INTENTS.START_CHAT,
    targetRoute: '/assistant',
    entities: { query: transcript },
    spokenResponses: {
      en: 'Opening AI Farm Chatbot with your query.',
      te: 'మీ ప్రశ్నతో ఏఐ చాట్‌బాట్‌ను తెరుస్తున్నాను.',
      hi: 'आपके प्रश्न के साथ एआई चैटबॉट खोल रहा हूँ।',
    },
  };
}

/**
 * Resolve spoken transcript to actionable intent
 */
export async function resolveIntent(transcript, language = 'en', currentRoute = '/') {
  if (!transcript || !transcript.trim()) {
    return {
      intent: 'NONE',
      spokenResponse: 'Sorry, I did not hear any command.',
    };
  }

  // 1. Try local pattern matching
  const localMatch = matchLocalIntent(transcript, language);
  const langKey = language.startsWith('te') ? 'te' : language.startsWith('hi') ? 'hi' : 'en';

  if (localMatch) {
    const spokenResponse = localMatch.spokenResponses?.[langKey] || localMatch.spokenResponses?.en || 'Opening.';
    return {
      intent: localMatch.intent,
      targetRoute: localMatch.targetRoute,
      action: localMatch.action,
      entities: localMatch.entities || {},
      spokenResponse,
      rawTranscript: transcript,
      source: 'local',
    };
  }

  // 2. Fallback to Groq AI intent resolver
  const aiMatch = await matchAIIntent(transcript, language, currentRoute);
  const spokenResponse =
    typeof aiMatch.spokenResponses === 'object'
      ? aiMatch.spokenResponses[langKey] || aiMatch.spokenResponses.en
      : aiMatch.spokenResponse || 'Opening AI Farm Chatbot.';

  return {
    intent: aiMatch.intent,
    targetRoute: aiMatch.targetRoute,
    action: aiMatch.action,
    entities: aiMatch.entities || {},
    spokenResponse,
    rawTranscript: transcript,
    source: 'groq-ai',
  };
}
