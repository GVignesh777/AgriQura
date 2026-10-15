import api from '../../services/api';

/**
 * Normalizes API calls with consistent error and fallback handling.
 */
export const helpDeskService = {
  /**
   * Fetch 8 Help Desk Categories
   */
  async getCategories() {
    try {
      const response = await api.get('/help/categories');
      return { data: response.data.categories || [], error: null };
    } catch (error) {
      console.warn('⚠️ [HelpDeskService] Using fallback categories:', error.message);
      return {
        data: [
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
        ],
        error: error.message,
      };
    }
  },

  /**
   * Fetch FAQs with optional search / category filtering
   */
  async getFaqs(params = {}) {
    try {
      const response = await api.get('/help/faqs', { params });
      return { data: response.data.faqs || [], error: null };
    } catch (error) {
      console.warn('⚠️ [HelpDeskService] Using fallback FAQs:', error.message);
      return {
        data: [
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
        ],
        error: error.message,
      };
    }
  },

  /**
   * Fetch Knowledge Center Guides & Resources
   */
  async getResources(params = {}) {
    try {
      const response = await api.get('/help/resources', { params });
      return { data: response.data.resources || [], error: null };
    } catch (error) {
      console.warn('⚠️ [HelpDeskService] Using fallback resources:', error.message);
      return {
        data: [
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
        ],
        error: error.message,
      };
    }
  },

  /**
   * Submit Problem Report
   */
  async reportProblem(payload) {
    try {
      const response = await api.post('/help/report', payload);
      return { data: response.data, error: null };
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Failed to submit problem report. Please try again.';
      return { data: null, error: errorMsg };
    }
  },

  /**
   * Fetch authenticated user's help history
   */
  async getHelpHistory() {
    try {
      const response = await api.get('/help/history');
      return { data: response.data.history || [], error: null };
    } catch (error) {
      console.warn('⚠️ [HelpDeskService] Could not fetch history:', error.message);
      return { data: [], error: error.message };
    }
  },

  /**
   * Fetch Nearby Agricultural Services & KVKs
   */
  async getNearbyServices(params = {}) {
    try {
      const response = await api.get('/help/services', { params });
      return { data: response.data.services || [], error: null };
    } catch (error) {
      console.warn('⚠️ [HelpDeskService] Using fallback services:', error.message);
      return {
        data: [
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
        ],
        error: error.message,
      };
    }
  },
};
