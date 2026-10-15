/**
 * AgriQura Global Voice Intelligence Layer - Command & Intent Registry
 * Comprehensive multilingual intent definitions, phrases, and entity extractors.
 */

export const INTENTS = {
  OPEN_DASHBOARD: 'OPEN_DASHBOARD',
  OPEN_AI_CHATBOT: 'OPEN_AI_CHATBOT',
  OPEN_CROP_DIAGNOSIS: 'OPEN_CROP_DIAGNOSIS',
  OPEN_WEATHER: 'OPEN_WEATHER',
  OPEN_MARKET_PRICES: 'OPEN_MARKET_PRICES',
  OPEN_GOVERNMENT_SCHEMES: 'OPEN_GOVERNMENT_SCHEMES',
  OPEN_SOIL_HEALTH: 'OPEN_SOIL_HEALTH',
  OPEN_MY_FARM: 'OPEN_MY_FARM',
  OPEN_ALERTS: 'OPEN_ALERTS',
  OPEN_PROFILE: 'OPEN_PROFILE',
  OPEN_CONTACT: 'OPEN_CONTACT',
  OPEN_HELP_DESK: 'OPEN_HELP_DESK',
  OPEN_FAQ: 'OPEN_FAQ',
  GO_HOME: 'GO_HOME',
  GO_BACK: 'GO_BACK',
  CLOSE: 'CLOSE',
  SEARCH: 'SEARCH',
  START_CHAT: 'START_CHAT',
  START_CROP_DIAGNOSIS: 'START_CROP_DIAGNOSIS',

  // Weather Intelligence Intents
  CHECK_CURRENT_WEATHER: 'CHECK_CURRENT_WEATHER',
  CHECK_TODAY_WEATHER: 'CHECK_TODAY_WEATHER',
  CHECK_TOMORROW_WEATHER: 'CHECK_TOMORROW_WEATHER',
  CHECK_WEEK_FORECAST: 'CHECK_WEEK_FORECAST',
  CHECK_RAIN: 'CHECK_RAIN',
  CHECK_TEMPERATURE: 'CHECK_TEMPERATURE',
  CHECK_WIND: 'CHECK_WIND',
  CHECK_HUMIDITY: 'CHECK_HUMIDITY',
  CHECK_WEATHER_ALERTS: 'CHECK_WEATHER_ALERTS',
  CHECK_SPRAYING_CONDITIONS: 'CHECK_SPRAYING_CONDITIONS',
  CHECK_IRRIGATION_CONDITIONS: 'CHECK_IRRIGATION_CONDITIONS',
  CHECK_FARMING_WEATHER: 'CHECK_FARMING_WEATHER',

  CHECK_MARKET_PRICE: 'CHECK_MARKET_PRICE',
  SEARCH_SCHEME: 'SEARCH_SCHEME',
  OPEN_SCHEME_DETAILS: 'OPEN_SCHEME_DETAILS',
  READ_PAGE: 'READ_PAGE',
  STOP: 'STOP',
  CANCEL: 'CANCEL',
};

// Known Commodity list for extraction
export const KNOWN_CROPS = [
  { key: 'Tomato', aliases: ['tomato', 'tomatoes', 'టమాట', 'టొమాటో', 'టమోటా', 'టమోట', 'टमाटर'] },
  { key: 'Cotton', aliases: ['cotton', 'పత్తి', 'ప్రత్తి', 'कपास', 'रूई'] },
  { key: 'Paddy', aliases: ['paddy', 'rice', 'వరి', 'బియ్యం', 'धान', 'चावल'] },
  { key: 'Chilli', aliases: ['chilli', 'chili', 'chillies', 'మిరప', 'మిర్చి', 'మిర్చిలు', 'मिर्च', 'लाल मिर्च'] },
  { key: 'Turmeric', aliases: ['turmeric', 'పసుపు', 'हल्दी'] },
  { key: 'Maize', aliases: ['maize', 'corn', 'మొక్కజొన్న', 'మక్క', 'मक्का', 'भुट्टा'] },
  { key: 'Onion', aliases: ['onion', 'onions', 'ఉల్లిపాయ', 'ఉల్లి', 'प्याज', 'कांदा'] },
  { key: 'Wheat', aliases: ['wheat', 'గోధుమ', 'గోధుమలు', 'गेहूं'] },
  { key: 'Soybean', aliases: ['soybean', 'soya', 'సోయాబీన్', 'సోయా', 'सोयाबीन'] },
  { key: 'Groundnut', aliases: ['groundnut', 'peanut', 'వేరుశనగ', 'పల్లీ', 'मूंगफली'] },
  { key: 'Mustard', aliases: ['mustard', 'ఆవాలు', 'सरसों'] },
  { key: 'Garlic', aliases: ['garlic', 'వెల్లుల్లి', 'लहसुन'] },
  { key: 'Banana', aliases: ['banana', 'అరటి', 'केला'] },
  { key: 'Potato', aliases: ['potato', 'potatoes', 'బంగాళాదుంప', 'ఆలూ', 'आलू'] },
];

// Multilingual Intent Definitions & Pattern Matching
export const COMMAND_REGISTRY = [
  // ───── AI Farm Chatbot ─────
  {
    intent: INTENTS.OPEN_AI_CHATBOT,
    targetRoute: '/assistant',
    spokenResponses: {
      en: 'Opening AI Farm Chatbot.',
      te: 'ఏఐ ఫార్మ్ చాట్‌బాట్‌ను తెరుస్తున్నాను.',
      hi: 'एआई फार्म चैटबॉट खोल रहा हूँ।',
    },
    patterns: [
      /open (ai|farm|the)?\s*(chatbot|assistant|chat)/i,
      /take me to (the)?\s*(farmer|ai|crop)?\s*(chatbot|assistant)/i,
      /launch (ai|farm)?\s*(chatbot|assistant)/i,
      /talk to (the)?\s*ai/i,
      /start (a)?\s*chat/i,
      // Telugu
      /చాట్‌బాట్(ను)?\s*(ఓపెన్|తెరువు|చూపించు)/i,
      /రైతు\s*సహాయకుడిని\s*తెరువు/i,
      // Hindi
      /चैटबॉट\s*(खोलो|दिखाओ|ओपन करो)/i,
      /किसान\s*सहायक\s*खोलो/i,
    ],
  },

  // ───── Crop Diagnosis / Disease Detection ─────
  {
    intent: INTENTS.OPEN_CROP_DIAGNOSIS,
    targetRoute: '/disease',
    spokenResponses: {
      en: 'Opening Crop Disease Diagnosis.',
      te: 'పంట వ్యాధి నిర్ధారణ విభాగాన్ని తెరుస్తున్నాను.',
      hi: 'फसल रोग जांच खोल रहा हूँ।',
    },
    patterns: [
      /(open|start|show)\s*(crop|plant|leaf)?\s*(disease|diagnosis|detection|screening|scanner)/i,
      /scan (my)?\s*(crop|leaf|plant)/i,
      /check (my)?\s*(crop|plant|leaf)\s*(disease|health)/i,
      // Telugu
      /పంట\s*(వ్యాధి|రోగాలు|పరీక్ష|స్కానింగ్)/i,
      /ఆకుల\s*వ్యాధిని\s*తనిఖీ/i,
      // Hindi
      /फसल\s*(बीमारी|रोग|जांच|स्कैन)/i,
      /पत्ते\s*की\s*बीमारी/i,
    ],
  },

  // ───── 1. Rain Query (CHECK_RAIN) ─────
  {
    intent: INTENTS.CHECK_RAIN,
    targetRoute: '/weather',
    spokenResponses: {
      en: 'Checking rain forecast.',
      te: 'వర్ష సూచనను తనిఖీ చేస్తున్నాను.',
      hi: 'बारिश का पूर्वानुमान देख रहा हूँ।',
    },
    patterns: [
      /(will it|is it going to|is there any chance of)\s*(rain|raining|showers|downpour)/i,
      /rain today/i,
      /rain tomorrow/i,
      /precipitation chance/i,
      // Telugu
      /వర్షం\s*(పడుతుందా|వస్తుందా|కురుస్తుందా|పడును)/i,
      /ఈరోజు\s*వర్షం/i,
      // Hindi
      /बारिश\s*(होगी क्या|आएगी क्या|पड़ेगी)/i,
      /आज\s*बारिश/i,
    ],
  },

  // ───── 2. Spraying Conditions (CHECK_SPRAYING_CONDITIONS) ─────
  {
    intent: INTENTS.CHECK_SPRAYING_CONDITIONS,
    targetRoute: '/weather',
    spokenResponses: {
      en: 'Checking pesticide and foliar spraying suitability.',
      te: 'మందుల పిచికారీ అనుకూలతను తనిఖీ చేస్తున్నాను.',
      hi: 'दवाई छिड़काव की स्थिति जांच रहा हूँ।',
    },
    patterns: [
      /(can i|should i|is it good to|is it safe to)\s*(spray|apply pesticide|apply fungicide)/i,
      /spraying weather/i,
      /spray conditions/i,
      // Telugu
      /(మందులు|పురుగుల మందు|స్ప్రే)\s*(చేయవచ్చా|కొట్టవచ్చా|వేయవచ్చా)/i,
      /పిచికారీ\s*చేయవచ్చా/i,
      // Hindi
      /(दवाई|कीटनाशक|स्प्रे)\s*(छिड़क सकते हैं क्या|डालें क्या|करें क्या)/i,
      /छिड़काव\s*कर\s*सकते\s*हैं/i,
    ],
  },

  // ───── 3. Irrigation Conditions (CHECK_IRRIGATION_CONDITIONS) ─────
  {
    intent: INTENTS.CHECK_IRRIGATION_CONDITIONS,
    targetRoute: '/weather',
    spokenResponses: {
      en: 'Checking irrigation advisory.',
      te: 'నీటి పారుదల సలహాను తనిఖీ చేస్తున్నాను.',
      hi: 'सिंचाई की सलाह देख रहा हूँ।',
    },
    patterns: [
      /(should i|can i|is it time to)\s*(irrigate|water the field|water my crop|turn on drip)/i,
      /irrigation advice/i,
      /watering today/i,
      // Telugu
      /(పొలానికి|పంటకు)?\s*(నీరు|నీళ్లు)\s*(పెట్టవచ్చా|కట్టవచ్చా|ఇవ్వవచ్చా)/i,
      /నీటి\s*పారుదల/i,
      // Hindi
      /(खेत में|फसल को)?\s*(पानी|सिंचाई)\s*(देना चाहिए क्या|करनी चाहिए क्या)/i,
      /पानी\s*लगाएं\s*क्या/i,
    ],
  },

  // ───── 4. Temperature Query (CHECK_TEMPERATURE) ─────
  {
    intent: INTENTS.CHECK_TEMPERATURE,
    targetRoute: '/weather',
    spokenResponses: {
      en: 'Checking current temperature.',
      te: 'ప్రస్తుత ఉష్ణోగ్రతను తనిఖీ చేస్తున్నాను.',
      hi: 'वर्तमान तापमान जांच रहा हूँ।',
    },
    patterns: [
      /(what is the|how is the)\s*(temperature|heat|hot outside)/i,
      /current temperature/i,
      // Telugu
      /ఉష్ణోగ్రత\s*(ఎంత|ఎలా ఉంది)/i,
      // Hindi
      /तापमान\s*(कितना है|कैसा है)/i,
    ],
  },

  // ───── 5. Wind Speed (CHECK_WIND) ─────
  {
    intent: INTENTS.CHECK_WIND,
    targetRoute: '/weather',
    spokenResponses: {
      en: 'Checking wind conditions.',
      te: 'గాలి వేగాన్ని తనిఖీ చేస్తున్నాను.',
      hi: 'हवा की गति जांच रहा हूँ।',
    },
    patterns: [
      /(how is the|what is the)\s*(wind|wind speed|breeze)/i,
      // Telugu
      /గాలి\s*(వేగం|ఎలా ఉంది)/i,
      // Hindi
      /हवा\s*(की गति|कैसी है)/i,
    ],
  },

  // ───── 6. Weather Alerts (CHECK_WEATHER_ALERTS) ─────
  {
    intent: INTENTS.CHECK_WEATHER_ALERTS,
    targetRoute: '/weather',
    spokenResponses: {
      en: 'Checking weather alerts.',
      te: 'వాతావరణ హెచ్చరికలను తనిਖీ చేస్తున్నాను.',
      hi: 'मौसम चेतावनियां जांच रहा हूँ।',
    },
    patterns: [
      /(any|check|show)\s*(weather alerts|storm warning|weather warnings|hazard)/i,
      // Telugu
      /వాతావరణ\s*హెచ్చరికలు/i,
      // Hindi
      /मौसम\s*(चेतावनी|अलर्ट)/i,
    ],
  },

  // ───── 7. General Weather Page (OPEN_WEATHER) ─────
  {
    intent: INTENTS.OPEN_WEATHER,
    targetRoute: '/weather',
    spokenResponses: {
      en: 'Opening Weather Intelligence.',
      te: 'వాతావరణ సమాచారాన్ని తెరుస్తున్నాను.',
      hi: 'मौसम की जानकारी खोल रहा हूँ।',
    },
    patterns: [
      /(open|show|check|what is the)\s*(weather|forecast)/i,
      /weather today/i,
      /weather forecast/i,
      // Telugu
      /వాతావరణం\s*(చూపించు|ఎలా ఉంది|తెరువు|ఓపెన్)/i,
      // Hindi
      /मौसम\s*(दिखाओ|कैसा है|खोलो)/i,
    ],
  },

  // ───── Market Prices / APMC Mandi Rates ─────
  {
    intent: INTENTS.OPEN_MARKET_PRICES,
    targetRoute: '/market',
    spokenResponses: {
      en: 'Opening Mandi Market Prices.',
      te: 'మార్కెట్ ధరలు మరియు మండి రేట్లను తెరుస్తున్నాను.',
      hi: 'मंडी भाव और बाजार दर खोल रहा हूँ।',
    },
    patterns: [
      /open (mandi|market|crop)?\s*(rates|prices|market)/i,
      /show (me)?\s*(the)?\s*(mandi|market|crop)?\s*(prices|rates)/i,
      /check mandi (rate|price)/i,
      // Telugu
      /మార్కెట్\s*ధరలు/i,
      /మండి\s*రేట్లు/i,
      // Hindi
      /मंडी\s*भाव/i,
      /बाजार\s*भाव/i,
    ],
  },

  // ───── Specific Crop Market Rate ─────
  {
    intent: INTENTS.CHECK_MARKET_PRICE,
    targetRoute: '/market',
    spokenResponses: {
      en: 'Checking market price.',
      te: 'మార్కెట్ ధరను తనిఖీ చేస్తున్నాను.',
      hi: 'बाजार भाव देख रहा हूँ।',
    },
    patterns: [
      /(what is the|check|show)\s*(price|rate|mandi rate)\s*(of|for)?\s*([a-zA-Z\u0C00-\u0C7F\u0900-\u097F]+)/i,
      /([a-zA-Z\u0C00-\u0C7F\u0900-\u097F]+)\s*(price|rate|mandi rate|rate today)/i,
      // Telugu
      /([a-zA-Z\u0C00-\u0C7F]+)\s*(ధర|రేటు|ధర ఎంత)/i,
      // Hindi
      /([a-zA-Z\u0900-\u097F]+)\s*(का भाव|की कीमत|का रेट)/i,
    ],
  },

  // ───── Government Schemes ─────
  {
    intent: INTENTS.OPEN_GOVERNMENT_SCHEMES,
    targetRoute: '/schemes',
    spokenResponses: {
      en: 'Opening Government Schemes & Subsidies.',
      te: 'ప్రభుత్వ పథకాలు మరియు సబ్సిడీలను తెరుస్తున్నాను.',
      hi: 'सरकारी योजनाएं और किसान सब्सिडी खोल रहा हूँ।',
    },
    patterns: [
      /open (govt|government)?\s*(schemes|subsidies|benefits)/i,
      /show (me)?\s*(the)?\s*(govt|government)?\s*(schemes|subsidies)/i,
      // Telugu
      /ప్రభుత్వ\s*(పథకాలు|సబ్సిడీలు)/i,
      // Hindi
      /सरकारी\s*(योजनाएं|सब्सिडी)/i,
    ],
  },

  // ───── Dashboard Navigation ─────
  {
    intent: INTENTS.OPEN_DASHBOARD,
    targetRoute: '/dashboard',
    spokenResponses: {
      en: 'Opening Farmer Dashboard.',
      te: 'రైతు డ్యాష్‌బోర్డ్‌ను తెరుస్తున్నాను.',
      hi: 'किसान डैशबोर्ड खोल रहा हूँ।',
    },
    patterns: [
      /open (the)?\s*(dashboard|home|main page)/i,
      /go to (the)?\s*dashboard/i,
      // Telugu
      /డ్యాష్‌బోర్డ్\s*(ఓపెన్|తెరువు|చూపించు)/i,
      // Hindi
      /डैशबोर्ड\s*(खोलो|दिखाओ)/i,
    ],
  },

  // ───── Stop / Cancel ─────
  {
    intent: INTENTS.STOP,
    action: 'STOP',
    spokenResponses: {
      en: 'Stopped.',
      te: 'ఆపబడింది.',
      hi: 'रोक दिया गया।',
    },
    patterns: [
      /^(stop|cancel|quiet|shut up|hush|pause)$/i,
      // Telugu
      /^(ఆపు|ఆపండి|చాలు)$/i,
      // Hindi
      /^(रुको|रोक दो|चुप रहो|बंद करो)$/i,
    ],
  },
];

/**
 * Extract crop entity from transcript
 */
export function extractCropEntity(transcript) {
  if (!transcript) return null;
  const lower = transcript.toLowerCase();

  for (const crop of KNOWN_CROPS) {
    for (const alias of crop.aliases) {
      if (lower.includes(alias.toLowerCase())) {
        return crop.key;
      }
    }
  }
  return null;
}

/**
 * Extract scheme query from transcript
 */
export function extractSchemeQuery(transcript) {
  if (!transcript) return null;
  const lower = transcript.toLowerCase();

  const schemes = [
    { name: 'PM-KISAN', aliases: ['pm kisan', 'pm-kisan', 'పీఎం కిసాన్', 'पीएम किसान', 'kisan samman'] },
    { name: 'Rythu Bandhu', aliases: ['rythu bandhu', 'రైతు బంధు', 'రైతుబంధు'] },
    { name: 'PM Fasal Bima Yojana', aliases: ['fasal bima', 'crop insurance', 'బీమా', 'फसल बीमा', 'pmfby'] },
    { name: 'Drip Irrigation Subsidy', aliases: ['drip', 'micro irrigation', 'బిందు సేద్యం', 'ड्रिप सिंचाई', 'sprinkler'] },
    { name: 'Kisan Credit Card', aliases: ['kisan credit card', 'kcc', 'కేసీసీ', 'केसीसी', 'loan'] },
    { name: 'Soil Health Card', aliases: ['soil card', 'soil health', 'సాయిల్ హెల్త్', 'मृदा स्वास्थ्य'] },
    { name: 'Kusum Solar Scheme', aliases: ['kusum', 'solar pump', 'సౌర పంపు', 'कुसुम'] },
  ];

  for (const item of schemes) {
    for (const alias of item.aliases) {
      if (lower.includes(alias.toLowerCase())) {
        return item.name;
      }
    }
  }
  return null;
}

