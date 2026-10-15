const Scheme = require('../database/models/Scheme');
const verifiedSchemesDataset = require('./schemesDataset');

let lastSyncTimestamp = new Date('2026-02-14T08:00:00Z');

/**
 * Seed or refresh database with verified government schemes dataset
 */
const syncSchemesDatabase = async () => {
  try {
    const existingCount = await Scheme.countDocuments();

    if (existingCount === 0) {
      console.log('🌾 [Government Schemes]: Initializing database with verified schemes dataset...');
      for (const item of verifiedSchemesDataset) {
        await Scheme.findOneAndUpdate(
          { schemeId: item.schemeId },
          { ...item, syncedAt: new Date() },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      }
      console.log(`✅ [Government Schemes]: Successfully seeded ${verifiedSchemesDataset.length} schemes.`);
    } else {
      // Upsert any missing schemes
      for (const item of verifiedSchemesDataset) {
        await Scheme.findOneAndUpdate(
          { schemeId: item.schemeId },
          { $setOnInsert: { ...item, syncedAt: new Date() } },
          { upsert: true, new: true }
        );
      }
    }
    lastSyncTimestamp = new Date();
    return { success: true, count: verifiedSchemesDataset.length, syncedAt: lastSyncTimestamp };
  } catch (error) {
    console.error('❌ [Government Schemes Sync Error]:', error.message);
    return { success: false, error: error.message };
  }
};

const getLastSyncInfo = () => {
  return {
    source: 'myScheme.gov.in (API Setu / Verified Repository)',
    lastSynchronized: lastSyncTimestamp,
    totalVerifiedSchemes: verifiedSchemesDataset.length,
    syncInterval: '12 Hours (Scheduled)'
  };
};

module.exports = {
  syncSchemesDatabase,
  getLastSyncInfo
};
