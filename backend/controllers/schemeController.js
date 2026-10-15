const Scheme = require('../database/models/Scheme');
const SavedScheme = require('../database/models/SavedScheme');
const verifiedSchemesDataset = require('../services/schemesDataset');
const { matchSchemesForProfile } = require('../services/schemeMatchingService');
const { getLastSyncInfo } = require('../services/schemeSyncService');
const { normalizeScheme } = require('../utils/schemeNormalizer');
const { getGroqClient } = require('../services/groqClient');

// In-memory fallback if MongoDB is not populated
let cachedSchemes = verifiedSchemesDataset.map(normalizeScheme);

/**
 * Helper to fetch schemes from DB or fallback cache
 */
const getAllSchemesFromSource = async () => {
  try {
    const dbSchemes = await Scheme.find().lean();
    if (dbSchemes && dbSchemes.length > 0) {
      return dbSchemes.map(normalizeScheme);
    }
  } catch (err) {
    console.warn('⚠️ [Schemes Controller]: MongoDB fetch fallback to in-memory dataset:', err.message);
  }
  return cachedSchemes;
};

/**
 * @route   GET /api/schemes
 * @desc    Get filtered, searched, and sorted schemes with pagination
 */
exports.getSchemes = async (req, res, next) => {
  try {
    const {
      state,
      governmentLevel,
      category,
      farmerType,
      crop,
      search,
      sort = 'recommended',
      page = 1,
      limit = 24
    } = req.query;

    let schemes = await getAllSchemesFromSource();

    // 1. Search Query Filter
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      schemes = schemes.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.shortDescription.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.ministry.toLowerCase().includes(q) ||
          s.crops.some((c) => c.toLowerCase().includes(q)) ||
          s.targetNeeds.some((n) => n.toLowerCase().includes(q))
      );
    }

    // 2. State Filter
    if (state && state !== 'All') {
      schemes = schemes.filter(
        (s) => s.state === 'All' || s.state.toLowerCase() === state.toLowerCase()
      );
    }

    // 3. Government Level Filter (Central vs State)
    if (governmentLevel && governmentLevel !== 'All') {
      schemes = schemes.filter(
        (s) => s.governmentLevel.toLowerCase() === governmentLevel.toLowerCase()
      );
    }

    // 4. Category / Need Filter
    if (category && category !== 'All') {
      schemes = schemes.filter(
        (s) =>
          s.category.toLowerCase() === category.toLowerCase() ||
          s.targetNeeds.some((n) => n.toLowerCase() === category.toLowerCase())
      );
    }

    // 5. Farmer Type Filter
    if (farmerType && farmerType !== 'All') {
      schemes = schemes.filter(
        (s) =>
          s.farmerTypes.some(
            (ft) => ft.toLowerCase() === farmerType.toLowerCase() || ft.toLowerCase() === 'all farmers'
          )
      );
    }

    // 6. Crop Filter
    if (crop && crop !== 'All' && crop !== 'Other') {
      schemes = schemes.filter(
        (s) =>
          s.crops.some(
            (c) => c.toLowerCase() === crop.toLowerCase() || c.toLowerCase() === 'all crops'
          )
      );
    }

    // 7. Sorting
    if (sort === 'name_asc') {
      schemes.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'recently_updated') {
      schemes.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
    }

    // 8. Pagination
    const totalCount = schemes.length;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 24;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedSchemes = schemes.slice(startIndex, startIndex + limitNum);

    res.status(200).json({
      success: true,
      totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      count: paginatedSchemes.length,
      schemes: paginatedSchemes,
      syncInfo: getLastSyncInfo()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/schemes/states
 * @desc    Get distinct list of Indian States & UTs with scheme counts
 */
exports.getStates = async (req, res, next) => {
  try {
    const all = await getAllSchemesFromSource();
    const stateCounts = {};

    all.forEach((s) => {
      if (s.state && s.state !== 'All') {
        stateCounts[s.state] = (stateCounts[s.state] || 0) + 1;
      }
    });

    const statesList = Object.keys(stateCounts)
      .sort()
      .map((name) => ({
        name,
        count: stateCounts[name] + (all.filter((s) => s.state === 'All').length)
      }));

    res.status(200).json({
      success: true,
      states: [
        { name: 'All States & UTs', count: all.length, code: 'All' },
        ...statesList
      ]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/schemes/categories
 * @desc    Get categories list with metadata
 */
exports.getCategories = async (req, res, next) => {
  try {
    const all = await getAllSchemesFromSource();
    const categoriesMap = {};

    all.forEach((s) => {
      if (s.category) {
        categoriesMap[s.category] = (categoriesMap[s.category] || 0) + 1;
      }
    });

    const categories = Object.keys(categoriesMap).map((name) => ({
      name,
      count: categoriesMap[name]
    }));

    res.status(200).json({
      success: true,
      categories
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/schemes/:id
 * @desc    Get single scheme full details
 */
exports.getSchemeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let scheme = null;

    try {
      scheme = await Scheme.findOne({ schemeId: id }).lean();
    } catch (err) {
      // ignore
    }

    if (!scheme) {
      scheme = cachedSchemes.find((s) => s.schemeId === id || s.id === id);
    }

    if (!scheme) {
      return res.status(404).json({
        success: false,
        error: `Scheme with ID '${id}' not found`
      });
    }

    res.status(200).json({
      success: true,
      scheme: normalizeScheme(scheme)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/schemes/match
 * @desc    Match schemes against multi-step wizard profile and return ranked results
 */
exports.matchSchemes = async (req, res, next) => {
  try {
    const { state, farmerType, crop, needs, landholding, exactAcres } = req.body;

    const allSchemes = await getAllSchemesFromSource();
    const matchedResults = matchSchemesForProfile(allSchemes, {
      state,
      farmerType,
      crop,
      needs,
      landholding,
      exactAcres
    });

    res.status(200).json({
      success: true,
      count: matchedResults.length,
      profileReceived: { state, farmerType, crop, needs, landholding, exactAcres },
      recommendedSchemes: matchedResults,
      disclaimer:
        'Relevance percentage is an AgriQura advisory estimate. Final eligibility and approvals are strictly determined by the respective government department.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/schemes/explain-ai
 * @desc    AI Scheme Explainer using Groq Llama-3 scoped strictly to scheme context
 */
exports.explainSchemeAI = async (req, res, next) => {
  try {
    const { schemeId, question, language = 'English', farmerContext = {} } = req.body;

    let scheme = null;
    try {
      scheme = await Scheme.findOne({ schemeId }).lean();
    } catch (err) {
      // ignore
    }
    if (!scheme) {
      scheme = cachedSchemes.find((s) => s.schemeId === schemeId || s.id === schemeId);
    }

    if (!scheme) {
      return res.status(404).json({ success: false, error: 'Scheme not found for AI explanation' });
    }

    const groq = getGroqClient();

    const systemPrompt = `
You are AgriQura Scheme Intelligence Assistant, helping Indian farmers understand government agricultural welfare schemes.

SCHEME CONTEXT:
- Scheme Name: ${scheme.name}
- Level: ${scheme.governmentLevel} (${scheme.state} State)
- Ministry: ${scheme.ministry}
- Category: ${scheme.category}
- Summary: ${scheme.shortDescription}
- Detailed Benefits: ${JSON.stringify(scheme.benefits)}
- Eligibility Criteria: ${JSON.stringify(scheme.eligibility)}
- Required Documents: ${JSON.stringify(scheme.requiredDocuments)}
- Application Process: ${JSON.stringify(scheme.applicationProcess)}
- Official Website: ${scheme.applicationUrl}

STRICT ADVISORY TRUST RULES:
1. NEVER claim a farmer IS ELIGIBLE. If asked about eligibility, respond with: "Based on the official criteria, this scheme may be relevant to you if you meet the requirements. Final eligibility and approval are determined exclusively by the respective government authority."
2. Never invent non-existent documents, phone numbers, or application links. Use only official information.
3. Respond in the requested language: ${language}.
4. Provide structured, simple, farmer-friendly explanations with bullet points and clear steps.
`;

    const userPrompt = question || `Please explain the benefits, eligibility conditions, required documents, and how to apply for ${scheme.name} in simple terms.`;

    if (!groq) {
      // Fallback mock explanation if Groq key is absent
      return res.status(200).json({
        success: true,
        explanation: `### Overview of ${scheme.name}\n\n**Key Benefit:** ${scheme.benefits.summary}\n\n**Official Eligibility:**\n${scheme.eligibility.criteria.map((c) => `- ${c}`).join('\n')}\n\n**Required Documents:**\n${scheme.requiredDocuments.map((d) => `- ${d}`).join('\n')}\n\n*Notice: AgriQura provides advisory guidance based on official publications. Final approval rests with the respective government authority.*`,
        language
      });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 1000
    });

    const reply = completion.choices[0]?.message?.content || 'Unable to generate scheme explanation.';

    res.status(200).json({
      success: true,
      explanation: reply,
      schemeName: scheme.name,
      language
    });
  } catch (error) {
    console.error('Groq AI Scheme Explainer Error:', error);
    res.status(200).json({
      success: true,
      explanation:
        'AgriQura AI Scheme Advisory is currently operating in offline mode. Please refer to the official document checklist and step-by-step application guidelines listed above.',
      language: req.body.language || 'English'
    });
  }
};

/**
 * @route   GET /api/schemes/saved
 * @desc    Get user's saved schemes and personal application tracker items
 */
exports.getSavedSchemes = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const saved = await SavedScheme.find({ userId }).sort({ updatedAt: -1 }).lean();
    res.status(200).json({ success: true, count: saved.length, savedSchemes: saved });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/schemes/saved
 * @desc    Save a scheme to user profile
 */
exports.saveScheme = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { schemeId, schemeName, category, state, governmentLevel, applicationUrl, personalNotes } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const saved = await SavedScheme.findOneAndUpdate(
      { userId, schemeId },
      {
        userId,
        schemeId,
        schemeName,
        category,
        state,
        governmentLevel,
        applicationUrl,
        personalNotes: personalNotes || ''
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, message: 'Scheme saved to your profile', savedScheme: saved });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/schemes/saved/:id
 * @desc    Update personal application tracker status and notes
 */
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;
    const { applicationStatus, personalNotes, documentsGathered } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const updated = await SavedScheme.findOneAndUpdate(
      { userId, schemeId: id },
      {
        ...(applicationStatus && { applicationStatus }),
        ...(personalNotes !== undefined && { personalNotes }),
        ...(documentsGathered && { documentsGathered }),
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Saved scheme record not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Application status updated in your personal tracker',
      savedScheme: updated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/schemes/saved/:id
 * @desc    Remove scheme from saved bookmarks
 */
exports.removeSavedScheme = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    await SavedScheme.findOneAndDelete({ userId, schemeId: id });
    res.status(200).json({ success: true, message: 'Scheme removed from saved list' });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/schemes/sync-status
 * @desc    Get data sync status and source attribution
 */
exports.getSyncStatus = (req, res) => {
  res.status(200).json({
    success: true,
    syncInfo: getLastSyncInfo()
  });
};
