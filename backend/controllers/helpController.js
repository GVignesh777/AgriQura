const HelpReport = require('../database/models/HelpReport');
const Conversation = require('../database/models/Conversation');
const Message = require('../database/models/Message');

// Mock data marked for agricultural services, categories, FAQs, and resources
const CATEGORIES = [
  {
    id: 'crop-advisory',
    slug: 'crop-advisory',
    name: 'Crop & Agronomy',
    description: 'Crop growth stages, sowing schedules, yield optimization, and field care.',
    icon: 'Leaf',
    color: 'emerald',
    badge: 'Popular',
    queryCount: 1420,
  },
  {
    id: 'pest-disease',
    slug: 'pest-disease',
    name: 'Pests & Diseases',
    description: 'Diagnose leaf damage, insect infestation, fungal blight, and bio-remedies.',
    icon: 'Bug',
    color: 'rose',
    badge: 'Urgent',
    queryCount: 1680,
  },
  {
    id: 'soil-fertilizer',
    slug: 'soil-fertilizer',
    name: 'Soil & Fertilizer',
    description: 'NPK dosage, nano-urea application, compost, and soil testing assistance.',
    icon: 'Sprout',
    color: 'lime',
    badge: null,
    queryCount: 740,
  },
  {
    id: 'irrigation-water',
    slug: 'irrigation-water',
    name: 'Irrigation & Water',
    description: 'Drip scheduling, borewell recharge, and critical moisture periods.',
    icon: 'Droplets',
    color: 'cyan',
    badge: null,
    queryCount: 520,
  },
  {
    id: 'govt-schemes',
    slug: 'govt-schemes',
    name: 'Government Schemes',
    description: 'PM-KISAN, Rythu Bandhu, PMFBY crop insurance, and subsidy forms.',
    icon: 'Landmark',
    color: 'indigo',
    badge: 'Subsidies',
    queryCount: 1150,
  },
  {
    id: 'account-app',
    slug: 'account-app',
    name: 'Account & App Support',
    description: 'Profile settings, farm registration, technical bugs, and login support.',
    icon: 'UserCheck',
    color: 'amber',
    badge: null,
    queryCount: 310,
  },
];

const FAQS = [
  {
    id: 'faq-1',
    category: 'crop-disease',
    question: 'How can I identify a crop disease?',
    answer: 'Navigate to Disease Scan in AgriQura, upload or capture a clear photo of the infected leaf or crop stem under good lighting. Our computer vision model identifies the pathogen (fungal, bacterial, viral, or deficiency) within seconds and provides organic and chemical treatment schedules tailored to your crop stage.',
    tags: ['disease', 'diagnosis', 'leaf', 'scan', 'pest'],
  },
  {
    id: 'faq-2',
    category: 'market-prices',
    question: "How can I check today's market price?",
    answer: 'Visit the Mandi Rates tab or ask the AI Assistant for your district. AgriQura aggregates daily APMC wholesale modal prices across major Indian mandis for commodities like Cotton, Paddy, Chilli, Maize, Soybean, and Turmeric, comparing weekly price changes to help you decide when to sell.',
    tags: ['market', 'mandi', 'price', 'rates', 'msp'],
  },
  {
    id: 'faq-3',
    category: 'soil-fertilizer',
    question: 'Which fertilizer is suitable for my crop?',
    answer: 'Recommended fertilizer dosages depend on your soil test values, crop variety, and vegetative phase. For instance, basal application in Cotton typically needs Nitrogen and Phosphorus (DAP/Urea), while top-dressing during flowering requires Potash (MOP) and micronutrient foliar sprays. Consult our Soil Health section or AI Assistant for customized ratios.',
    tags: ['fertilizer', 'soil', 'urea', 'npk', 'dap', 'dosage'],
  },
  {
    id: 'faq-4',
    category: 'irrigation-water',
    question: 'When should I irrigate my crop?',
    answer: 'Irrigate during critical crop growth stages (such as seedling emergence, panicle initiation in paddy, or boll formation in cotton). Avoid irrigating immediately before forecast heavy rains. AgriQura analyzes live 7-day precipitation forecasts to recommend optimal irrigation intervals.',
    tags: ['irrigation', 'water', 'drip', 'rainfall', 'moisture'],
  },
  {
    id: 'faq-5',
    category: 'voice-assistant',
    question: "How can I use AgriQura's voice assistant?",
    answer: 'Click the "Voice Mode" button in the navigation bar or floating widget, select your regional language (Telugu, Hindi, or English), tap the microphone icon, and speak naturally about your farm question. AgriQura transcribes and responds with spoken audio advice.',
    tags: ['voice', 'microphone', 'telugu', 'hindi', 'speech', 'audio'],
  },
  {
    id: 'faq-6',
    category: 'account-app',
    question: 'How can I change my language?',
    answer: 'You can switch languages anytime using the language pill (EN / हि / తె) at the top of the navigation bar, or update your preferred dialect inside your Profile Settings to receive automated voice and alert notifications in your native language.',
    tags: ['language', 'english', 'hindi', 'telugu', 'settings', 'profile'],
  },
  {
    id: 'faq-7',
    category: 'account-app',
    question: 'How can I report an incorrect AI response?',
    answer: 'Under any message response in the AI Assistant, click the Thumbs Down icon or visit this Help Desk page under "Report a Problem". Describe what seemed inaccurate so our agricultural agronomy team can review and retune the advisory model.',
    tags: ['feedback', 'report', 'incorrect', 'thumbs down', 'support'],
  },
  {
    id: 'faq-8',
    category: 'crop-disease',
    question: 'Can AgriQura provide personalized recommendations?',
    answer: "Yes. When you register your farm profile with crop type, acreage, soil classification, sowing date, and district, AgriQura's AI factors in local weather, localized agronomy practices, and regional disease vectors to personalize all recommendations.",
    tags: ['personalized', 'farm', 'soil', 'custom', 'recommendations'],
  },
  {
    id: 'faq-9',
    category: 'govt-schemes',
    question: 'How do I check my eligibility for PM-KISAN or PMFBY?',
    answer: 'Go to the Govt Schemes section in the navbar. AgriQura lists national and state-specific agricultural welfare programs with step-by-step documentation checklists, eligibility criteria, subsidy percentages, and direct official portal links.',
    tags: ['schemes', 'pm kisan', 'pmfby', 'subsidy', 'insurance', 'government'],
  },
  {
    id: 'faq-10',
    category: 'weather-climate',
    question: 'How accurate is the weather radar and spray advisory?',
    answer: 'AgriQura integrates hyper-local OpenWeather API data with real-time satellite updates. The spray advisory flags high-wind conditions (>15 km/h) and imminent precipitation (<24h) to prevent pesticide wash-off and ensure maximum chemical efficacy.',
    tags: ['weather', 'spray', 'wind', 'rain', 'pesticide', 'forecast'],
  },
];

const RESOURCES = [
  {
    id: 'res-1',
    category: 'Crop Guides',
    title: 'High-Yield Cotton Agronomy: Sowing to Harvest',
    description: 'Best practices for spacing, Bt-cotton bollworm protection, and timely micro-nutrient spraying.',
    readTime: '5 min read',
    tags: ['Cotton', 'High Yield', 'Agronomy'],
    icon: 'Leaf',
    author: 'AgriQura Agronomy Desk',
  },
  {
    id: 'res-2',
    category: 'Disease Management',
    title: 'Managing Late Blight in Tomato & Potato Crops',
    description: 'Early visual symptoms, prophylactic copper oxychloride sprays, and resistant seed varieties.',
    readTime: '4 min read',
    tags: ['Tomato', 'Late Blight', 'Fungicide'],
    icon: 'Bug',
    author: 'Plant Pathology Unit',
  },
  {
    id: 'res-3',
    category: 'Pest Management',
    title: 'Integrated Pest Management (IPM) for Fall Armyworm',
    description: 'Pheromone traps, bio-pesticides (Bt, Neem oil), and chemical thresholds for Maize protection.',
    readTime: '6 min read',
    tags: ['Maize', 'Armyworm', 'IPM'],
    icon: 'Shield',
    author: 'ICAR Advisory Note',
  },
  {
    id: 'res-4',
    category: 'Fertilizer Guides',
    title: 'Balanced NPK Ratios & Nano Urea Application',
    description: 'How to split nitrogen doses efficiently and apply foliar nano-urea to cut fertilizer costs by 30%.',
    readTime: '4 min read',
    tags: ['Fertilizer', 'Nano Urea', 'NPK'],
    icon: 'Sprout',
    author: 'Soil Science Dept',
  },
  {
    id: 'res-5',
    category: 'Irrigation Guides',
    title: 'Drip Irrigation Maintenance & Acid Treatment',
    description: 'Prevent emitter clogging from hard water salts, flush driplines, and calculate water requirements.',
    readTime: '5 min read',
    tags: ['Drip', 'Water Conservation', 'Irrigation'],
    icon: 'Droplets',
    author: 'Water Management Board',
  },
  {
    id: 'res-6',
    category: 'Seasonal Farming Tips',
    title: 'Kharif to Rabi Transition: Land Prep & Seed Selection',
    description: 'Deep summer ploughing, green manuring with Dhaincha, and moisture conservation strategies.',
    readTime: '7 min read',
    tags: ['Kharif', 'Rabi', 'Land Preparation'],
    icon: 'Tractor',
    author: 'AgriQura Extension Service',
  },
  {
    id: 'res-7',
    category: 'Weather-Based Farming',
    title: 'Managing Crop Stress during Unseasonal Hail & Rain',
    description: 'Post-rain field drainage, potassium nitrate sprays to reduce shock, and immediate PMFBY claim filing.',
    readTime: '4 min read',
    tags: ['Weather', 'Hailstorm', 'Disaster Relief'],
    icon: 'CloudRain',
    author: 'Climate Resilience Cell',
  },
  {
    id: 'res-8',
    category: 'Government Schemes',
    title: 'Guide to Agriculture Infrastructure Fund (AIF) 3% Subsidy',
    description: 'Financing warehouse, cold storage, and custom hiring center loans with interest subvention.',
    readTime: '6 min read',
    tags: ['AIF', 'Subsidy', 'Loans', 'Cold Storage'],
    icon: 'Landmark',
    author: 'Govt Schemes Desk',
  },
];

// Sample mock data for Nearby Agricultural Services (Clearly labeled as sample data)
const NEARBY_SERVICES = [
  {
    id: 'srv-1',
    name: 'Krishi Vigyan Kendra (KVK) - District Center',
    category: 'Krishi Vigyan Kendra',
    address: 'Agricultural Research Station Campus, Subedari, Warangal, Telangana - 506001',
    phone: '+91 870 257 8901',
    distanceKm: 4.2,
    timings: '09:30 AM - 05:30 PM (Mon - Sat)',
    servicesOffered: ['Soil Testing', 'Certified Seeds', 'Plant Pathology Clinic', 'Farmer Training'],
    officerInCharge: 'Dr. K. Ramesh (Senior Agronomist)',
    coordinates: { lat: 17.9689, lng: 79.5941 },
  },
  {
    id: 'srv-2',
    name: 'District Agricultural Office (Rythu Seva Kendram)',
    category: 'Government Agriculture Center',
    address: 'Collectorate Complex, Hanamkonda, Warangal Urban, Telangana - 506002',
    phone: '+91 870 245 6112',
    distanceKm: 6.8,
    timings: '10:00 AM - 05:00 PM (Mon - Fri)',
    servicesOffered: ['PM-KISAN Verification', 'Fertilizer Subsidies', 'Farm Mechanization Grants'],
    officerInCharge: 'Smt. P. Vanitha (District Agriculture Officer)',
    coordinates: { lat: 18.0134, lng: 79.5521 },
  },
  {
    id: 'srv-3',
    name: 'National Seeds Corporation (NSC) Outlet',
    category: 'Seed/Fertilizer Center',
    address: 'Near Old Bus Stand, Kazipet Main Road, Warangal - 506003',
    phone: '+91 870 243 9087',
    distanceKm: 8.5,
    timings: '09:00 AM - 07:00 PM (Daily)',
    servicesOffered: ['Certified Foundation Seeds', 'Bio-fertilizers', 'Neem Seed Cake', 'Sprayers'],
    officerInCharge: 'M. Sudhakar (Store Manager)',
    coordinates: { lat: 17.9798, lng: 79.5218 },
  },
  {
    id: 'srv-4',
    name: 'State Soil & Water Testing Laboratory',
    category: 'Agricultural Office',
    address: 'Professor Jayashankar Telangana State Agricultural University Extension, Warangal - 506007',
    phone: '+91 870 252 3344',
    distanceKm: 11.3,
    timings: '10:00 AM - 04:30 PM (Mon - Fri)',
    servicesOffered: ['Full 12-Parameter Soil Health Card', 'Micronutrient (Zn, B, Fe) Analysis', 'Borewell Water EC/pH Testing'],
    officerInCharge: 'Dr. B. Anjaneyulu (Chief Analyst)',
    coordinates: { lat: 18.0312, lng: 79.6231 },
  },
];

/**
 * @desc    Get all Help Categories
 * @route   GET /api/help/categories
 */
exports.getCategories = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      count: CATEGORIES.length,
      categories: CATEGORIES,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all FAQs with optional search/category filter
 * @route   GET /api/help/faqs
 */
exports.getFaqs = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let results = [...FAQS];

    if (category && category !== 'all') {
      results = results.filter((f) => f.category === category);
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      results = results.filter(
        (f) =>
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q) ||
          f.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    res.status(200).json({
      success: true,
      count: results.length,
      faqs: results,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all Knowledge Center Resources
 * @route   GET /api/help/resources
 */
exports.getResources = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let results = [...RESOURCES];

    if (category && category !== 'all') {
      results = results.filter((r) => r.category.toLowerCase() === category.toLowerCase());
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      results = results.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    res.status(200).json({
      success: true,
      count: results.length,
      resources: results,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit a Problem Report
 * @route   POST /api/help/report
 */
exports.reportProblem = async (req, res, next) => {
  try {
    const { category, description, screenshot, location, contactPhone, farmerName } = req.body;

    if (!category) {
      return res.status(400).json({ success: false, error: 'Please select a problem category.' });
    }

    if (!description || description.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Please describe the problem with at least 10 characters so our team can assist effectively.',
      });
    }

    // Screenshot size guard check (approx 5MB base64 limit)
    if (screenshot && typeof screenshot === 'string' && screenshot.length > 7 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        error: 'Uploaded screenshot exceeds maximum allowed size of 5MB.',
      });
    }

    const report = await HelpReport.create({
      user: req.user ? req.user._id : null,
      farmerName: req.user?.name || farmerName || 'Guest Farmer',
      contactPhone: contactPhone || req.user?.phone || '',
      category,
      description: description.trim(),
      screenshot: screenshot || null,
      location: location || '',
      status: 'Open',
      priority: category === 'Technical Issue' || category === 'AI Response' ? 'High' : 'Medium',
    });

    res.status(201).json({
      success: true,
      message: 'Thanks for helping us improve AgriQura. Your issue has been submitted successfully.',
      reportId: report._id,
      ticket: {
        id: report._id,
        category: report.category,
        status: report.status,
        createdAt: report.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Help & Query History (Auth Required)
 * @route   GET /api/help/history
 */
exports.getHelpHistory = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required to view help history.' });
    }

    // Fetch reports filed by user
    const reports = await HelpReport.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    // Fetch recent conversations/queries
    const conversations = await Conversation.find({ user: req.user._id })
      .sort({ lastMessageAt: -1 })
      .limit(10);

    const historyItems = [
      ...reports.map((r) => ({
        id: r._id,
        type: 'ticket',
        title: `Report: ${r.category}`,
        category: r.category,
        description: r.description,
        status: r.status,
        createdAt: r.createdAt,
      })),
      ...conversations.map((c) => ({
        id: c._id,
        type: 'query',
        title: c.title || 'Agricultural Advisory Query',
        category: 'AI Assistant',
        description: 'AI Conversation Session',
        status: 'Completed',
        createdAt: c.createdAt || c.lastMessageAt,
      })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      success: true,
      count: historyItems.length,
      history: historyItems,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Nearby Agricultural Services
 * @route   GET /api/help/services
 */
exports.getNearbyServices = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let services = [...NEARBY_SERVICES];

    if (category && category !== 'all') {
      services = services.filter((s) => s.category.toLowerCase() === category.toLowerCase());
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      services = services.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.address.toLowerCase().includes(q) ||
          s.servicesOffered.some((item) => item.toLowerCase().includes(q))
      );
    }

    res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    next(error);
  }
};
