/**
 * Normalizes raw scheme data from DB or external API into standard AgriQura Scheme format
 */
const normalizeScheme = (raw) => {
  if (!raw) return null;

  const data = raw.toObject ? raw.toObject() : { ...raw };

  return {
    id: data.schemeId || data._id?.toString(),
    schemeId: data.schemeId,
    name: data.name || data.schemeName || 'Government Agricultural Scheme',
    shortDescription: data.shortDescription || data.description?.slice(0, 160) || '',
    description: data.description || data.fullDescription || '',
    governmentLevel: data.governmentLevel || (data.state === 'All' ? 'Central' : 'State'),
    state: data.state || 'All',
    ministry: data.ministry || 'Ministry of Agriculture & Farmers Welfare',
    department: data.department || 'Department of Agriculture and Farmers Welfare',
    category: data.category || 'Financial Assistance',
    targetNeeds: Array.isArray(data.targetNeeds) ? data.targetNeeds : [],
    crops: Array.isArray(data.crops) ? data.crops : ['All Crops'],
    farmerTypes: Array.isArray(data.farmerTypes) ? data.farmerTypes : ['All Farmers'],
    benefits: {
      summary: data.benefits?.summary || data.benefits?.[0] || 'Government agricultural welfare benefit.',
      amountText: data.benefits?.amountText || 'Subsidized / Direct Benefit',
      details: Array.isArray(data.benefits?.details) ? data.benefits.details : (Array.isArray(data.benefits) ? data.benefits : [])
    },
    eligibility: {
      summary: data.eligibility?.summary || 'Applicable to Indian farmers holding valid land records.',
      criteria: Array.isArray(data.eligibility?.criteria)
        ? data.eligibility.criteria
        : (Array.isArray(data.eligibilityCriteria) ? data.eligibilityCriteria : []),
      minLandAcres: data.eligibility?.minLandAcres || 0,
      maxLandAcres: data.eligibility?.maxLandAcres || null,
      applicableStates: Array.isArray(data.eligibility?.applicableStates)
        ? data.eligibility.applicableStates
        : [data.state || 'All']
    },
    requiredDocuments: Array.isArray(data.requiredDocuments) ? data.requiredDocuments : ['Aadhaar Card', 'Land Records', 'Bank Passbook'],
    applicationProcess: Array.isArray(data.applicationProcess) ? data.applicationProcess : [],
    applicationUrl: data.applicationUrl || data.officialSourceUrl || '',
    officialSource: data.officialSource || 'Government of India / State Government',
    sourcePortal: data.sourcePortal || 'myScheme.gov.in',
    lastUpdated: data.lastUpdated || '2026-02-14',
    syncedAt: data.syncedAt || new Date(),
    status: data.status || 'Active',
    importantDates: data.importantDates || { applicationDeadline: 'Open Throughout the Year' },
    match: data.match || null
  };
};

module.exports = {
  normalizeScheme
};
