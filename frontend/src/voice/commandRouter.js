/**
 * AgriQura Context-Aware Command Router
 * Executes navigation, in-page state filtering, dynamic weather intelligence answers,
 * and chat handoffs across the application.
 */

import { INTENTS } from './voiceCommandRegistry';
import { stopSpeaking } from './ttsService';
import { weatherService } from '../services/weatherService';
import { locationService } from '../services/locationService';

export async function executeCommand(intentResult, { navigate, location }) {
  const { intent, targetRoute, action, entities, spokenResponse, rawTranscript } = intentResult;
  const currentPath = location?.pathname || '/';

  // 1. Handle Immediate STOP / CANCEL Actions
  if (intent === INTENTS.STOP || intent === INTENTS.CANCEL || action === 'STOP') {
    stopSpeaking();
    return {
      success: true,
      actionExecuted: 'STOP',
      spokenResponse: spokenResponse || 'Stopped.',
    };
  }

  // 2. Handle GO_BACK
  if (intent === INTENTS.GO_BACK || action === 'BACK') {
    if (navigate) navigate(-1);
    return {
      success: true,
      actionExecuted: 'GO_BACK',
      spokenResponse,
    };
  }

  // 3. Dynamic Weather Intelligence Voice Handlers
  if (
    intent === INTENTS.CHECK_RAIN ||
    intent === INTENTS.CHECK_SPRAYING_CONDITIONS ||
    intent === INTENTS.CHECK_IRRIGATION_CONDITIONS ||
    intent === INTENTS.CHECK_TEMPERATURE ||
    intent === INTENTS.CHECK_WIND ||
    intent === INTENTS.CHECK_WEATHER_ALERTS ||
    intent === INTENTS.CHECK_TODAY_WEATHER
  ) {
    try {
      const activeLoc = locationService.getActiveLocation();
      const weather = await weatherService.getForecast({
        lat: activeLoc.latitude,
        lon: activeLoc.longitude,
        locationName: activeLoc.name,
      });

      if (weather && weather.current) {
        const cur = weather.current;
        const todayDaily = weather.daily?.[0] || {};
        const rainProb = todayDaily.precipitationProbability ?? cur.precipitationProbability ?? 0;
        const rainMm = todayDaily.precipitation ?? cur.precipitation ?? 0;
        const wind = cur.windSpeed;
        const locName = activeLoc.name || 'your farm';

        let customVoiceResponse = '';

        if (intent === INTENTS.CHECK_RAIN) {
          if (rainProb > 50) {
            customVoiceResponse = `Rain is likely in ${locName} today with a ${rainProb}% chance and around ${rainMm} millimeters of rainfall. We recommend pausing irrigation and outdoor spraying.`;
          } else if (rainProb > 20) {
            customVoiceResponse = `There is a moderate ${rainProb}% chance of light scattered showers in ${locName} today.`;
          } else {
            customVoiceResponse = `No significant rain expected in ${locName} today. Rain probability is low at ${rainProb}%.`;
          }
        } else if (intent === INTENTS.CHECK_SPRAYING_CONDITIONS) {
          const sprayAct = weather.activities?.find((a) => a.key === 'spraying');
          if (sprayAct) {
            customVoiceResponse = `For pesticide spraying today: ${sprayAct.status}. ${sprayAct.reason}`;
          } else {
            customVoiceResponse = wind < 15 && rainProb < 30
              ? `Spraying conditions are favorable in ${locName}. Wind is calm at ${wind} km/h with low rain probability.`
              : `Spraying is not recommended right now due to wind speed of ${wind} km/h and ${rainProb}% rain chance.`;
          }
        } else if (intent === INTENTS.CHECK_IRRIGATION_CONDITIONS) {
          const irrAct = weather.activities?.find((a) => a.key === 'irrigation');
          if (irrAct) {
            customVoiceResponse = `Irrigation advisory for ${locName}: ${irrAct.status}. ${irrAct.reason}`;
          } else {
            customVoiceResponse = rainProb > 50
              ? `Upcoming rain expected (${rainProb}% chance). You can pause irrigation today.`
              : `Maintain regular irrigation. Temperature is ${cur.temperature}°C with ${cur.humidity}% humidity.`;
          }
        } else if (intent === INTENTS.CHECK_TEMPERATURE) {
          customVoiceResponse = `The current temperature in ${locName} is ${cur.temperature}°C, feeling like ${cur.feelsLike}°C, with ${cur.condition}.`;
        } else if (intent === INTENTS.CHECK_WIND) {
          customVoiceResponse = `Current wind speed in ${locName} is ${wind} km/h. ${wind > 20 ? 'High winds may cause spray drift.' : 'Wind conditions are calm.'}`;
        } else if (intent === INTENTS.CHECK_WEATHER_ALERTS) {
          const highRisks = (weather.risks || []).filter((r) => r.level === 'High');
          if (highRisks.length > 0) {
            customVoiceResponse = `Weather alerts detected: ${highRisks.map((r) => `${r.label}: ${r.reason}`).join('. ')}`;
          } else {
            customVoiceResponse = `No severe weather alerts in ${locName}. Current conditions are ${cur.condition} at ${cur.temperature}°C.`;
          }
        } else {
          customVoiceResponse = `Today in ${locName}: ${cur.condition}, temperature ${cur.temperature}°C, and ${rainProb}% chance of rain.`;
        }

        if (currentPath !== '/weather' && navigate) {
          navigate('/weather');
        }

        return {
          success: true,
          actionExecuted: 'SPOKE_WEATHER',
          targetRoute: '/weather',
          spokenResponse: customVoiceResponse,
        };
      }
    } catch (weatherVoiceErr) {
      console.warn('⚠️ Weather voice lookup error:', weatherVoiceErr);
    }
  }

  // 4. Handle Context-Aware Market Price Filtering
  if (intent === INTENTS.CHECK_MARKET_PRICE && entities?.crop) {
    if (currentPath === '/market') {
      window.dispatchEvent(
        new CustomEvent('agriqura-market-filter', { detail: { crop: entities.crop } })
      );
    } else if (navigate) {
      navigate(`/market?crop=${encodeURIComponent(entities.crop)}`);
    }
    return {
      success: true,
      actionExecuted: 'FILTER_MARKET',
      targetRoute: `/market?crop=${encodeURIComponent(entities.crop)}`,
      spokenResponse,
    };
  }

  // 5. Handle Context-Aware Scheme Search
  if (intent === INTENTS.SEARCH_SCHEME && entities?.scheme) {
    if (currentPath === '/schemes') {
      window.dispatchEvent(
        new CustomEvent('agriqura-scheme-search', { detail: { query: entities.scheme } })
      );
    } else if (navigate) {
      navigate(`/schemes?search=${encodeURIComponent(entities.scheme)}`);
    }
    return {
      success: true,
      actionExecuted: 'SEARCH_SCHEME',
      targetRoute: `/schemes?search=${encodeURIComponent(entities.scheme)}`,
      spokenResponse,
    };
  }

  // 6. Handle AI Chatbot Handoff
  if (intent === INTENTS.START_CHAT || intent === INTENTS.OPEN_AI_CHATBOT) {
    const question = entities?.query || rawTranscript;
    const cleanQuestion = question
      .replace(/^(hey qura|qura|ask the ai|ask ai|ask chatbot|tell me)/i, '')
      .trim();

    if (currentPath === '/assistant') {
      if (cleanQuestion) {
        window.dispatchEvent(
          new CustomEvent('agriqura-voice-chat-submit', { detail: { message: cleanQuestion } })
        );
      }
    } else if (navigate) {
      const target = cleanQuestion
        ? `/assistant?q=${encodeURIComponent(cleanQuestion)}&auto=true`
        : '/assistant';
      navigate(target);
    }

    return {
      success: true,
      actionExecuted: 'CHAT_HANDOFF',
      targetRoute: '/assistant',
      spokenResponse,
    };
  }

  // 7. Standard Route Navigation
  if (targetRoute && navigate) {
    navigate(targetRoute);
    return {
      success: true,
      actionExecuted: 'NAVIGATE',
      targetRoute,
      spokenResponse,
    };
  }

  return {
    success: false,
    actionExecuted: 'NONE',
    spokenResponse: 'Command received.',
  };
}
