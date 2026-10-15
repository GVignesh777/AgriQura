/**
 * AgriQura Scheme Recommendation & Multi-Factor Matching Algorithm
 * Calculates "AgriQura Relevance %" score based on farmer profile inputs.
 * Strictly adheres to non-official recommendation language rules ("likely relevant based on profile").
 */

const calculateSchemeMatch = (scheme, profile = {}) => {
  const {
    state = 'All',
    farmerType = '',
    crop = '',
    needs = [],
    landholding = '',
    exactAcres = null
  } = profile;

  let totalWeight = 0;
  let score = 0;
  const matchReasons = [];

  // 1. Location / State Match (Weight: 30)
  totalWeight += 30;
  const targetState = (state || '').toLowerCase().trim();
  const schemeState = (scheme.state || 'All').toLowerCase().trim();

  if (schemeState === 'all' || scheme.governmentLevel === 'Central') {
    score += 26;
    matchReasons.push('Central Government Program available pan-India');
  } else if (targetState && (schemeState === targetState || targetState.includes(schemeState) || schemeState.includes(targetState))) {
    score += 30;
    matchReasons.push(`State-specific welfare scheme exclusively for ${scheme.state} farmers`);
  } else {
    // If state scheme doesn't match selected state, heavily penalize or skip
    return null;
  }

  // 2. Support Need Category Match (Weight: 30)
  totalWeight += 30;
  const requestedNeeds = Array.isArray(needs) ? needs : (needs ? [needs] : []);
  if (requestedNeeds.length > 0) {
    const schemeCategory = (scheme.category || '').toLowerCase();
    const schemeNeeds = (scheme.targetNeeds || []).map((n) => n.toLowerCase());

    let hasNeedMatch = false;
    requestedNeeds.forEach((need) => {
      const needLower = need.toLowerCase();
      if (
        schemeCategory.includes(needLower) ||
        needLower.includes(schemeCategory) ||
        schemeNeeds.some((sn) => sn.includes(needLower) || needLower.includes(sn))
      ) {
        hasNeedMatch = true;
        matchReasons.push(`Matches your priority for ${need}`);
      }
    });

    if (hasNeedMatch) {
      score += 30;
    } else {
      score += 10; // Partial baseline
    }
  } else {
    score += 20; // Default when no specific need selected
  }

  // 3. Crop Compatibility (Weight: 20)
  totalWeight += 20;
  const selectedCrop = (crop || '').toLowerCase().trim();
  if (selectedCrop && selectedCrop !== 'other' && selectedCrop !== 'multiple crops') {
    const schemeCrops = (scheme.crops || []).map((c) => c.toLowerCase());
    const isAllCrops = schemeCrops.some((c) => c.includes('all') || c.includes('any'));
    const isCropMatch = schemeCrops.some((c) => c.includes(selectedCrop) || selectedCrop.includes(c));

    if (isCropMatch && !isAllCrops) {
      score += 20;
      matchReasons.push(`Specifically targeted for ${crop} crop cultivation`);
    } else if (isAllCrops) {
      score += 17;
      matchReasons.push(`Covers all agricultural crops including ${crop}`);
    } else {
      score += 6;
    }
  } else {
    score += 16;
  }

  // 4. Farmer Type / Category Match (Weight: 10)
  totalWeight += 10;
  const selectedFarmerType = (farmerType || '').toLowerCase().trim();
  if (selectedFarmerType && selectedFarmerType !== 'other') {
    const schemeFarmerTypes = (scheme.farmerTypes || []).map((ft) => ft.toLowerCase());
    const isFarmerTypeMatch = schemeFarmerTypes.some(
      (ft) => ft.includes(selectedFarmerType) || selectedFarmerType.includes(ft) || ft.includes('all')
    );

    if (isFarmerTypeMatch) {
      score += 10;
      matchReasons.push(`Supports ${farmerType} category farmers`);
    } else {
      score += 3;
    }
  } else {
    score += 8;
  }

  // 5. Landholding Suitability (Weight: 10)
  totalWeight += 10;
  let parsedAcres = exactAcres ? parseFloat(exactAcres) : null;
  if (!parsedAcres && landholding) {
    if (landholding === '<1 acre') parsedAcres = 0.8;
    else if (landholding === '1–2') parsedAcres = 1.5;
    else if (landholding === '2–5') parsedAcres = 3.5;
    else if (landholding === '5–10') parsedAcres = 7.5;
    else if (landholding === '>10 acres') parsedAcres = 12.0;
  }

  const maxLand = scheme.eligibility?.maxLandAcres;
  const minLand = scheme.eligibility?.minLandAcres || 0;

  if (parsedAcres !== null) {
    if (maxLand && parsedAcres > maxLand) {
      // Exceeds maximum land cap
      score += 2;
    } else if (parsedAcres < minLand) {
      score += 2;
    } else {
      score += 10;
      matchReasons.push(`Land size within eligible criteria (${parsedAcres} acres)`);
    }
  } else {
    score += 8;
  }

  // Calculate percentage (between 60% and 98% for realistic recommendation confidence)
  let percentage = Math.round((score / totalWeight) * 100);
  if (percentage > 98) percentage = 98;
  if (percentage < 60) percentage = 60;

  return {
    relevanceScore: percentage,
    relevanceLabel: `${percentage}% Relevant`,
    matchText: 'Likely relevant based on your profile',
    matchReasons: matchReasons.slice(0, 3),
    disclaimer: 'AgriQura estimate. Final eligibility is determined by the official scheme authority.'
  };
};

/**
 * Match a list of schemes against a user profile and rank by AgriQura Relevance
 */
const matchSchemesForProfile = (schemes = [], profile = {}) => {
  const ranked = [];

  for (const scheme of schemes) {
    const match = calculateSchemeMatch(scheme, profile);
    if (match) {
      const schemeObj = scheme.toObject ? scheme.toObject() : { ...scheme };
      ranked.push({
        ...schemeObj,
        match
      });
    }
  }

  // Sort descending by relevance score
  ranked.sort((a, b) => b.match.relevanceScore - a.match.relevanceScore);

  return ranked;
};

module.exports = {
  calculateSchemeMatch,
  matchSchemesForProfile
};
