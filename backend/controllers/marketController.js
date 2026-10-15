const { fetchAgmarknetPricesFromDataGov, FALLBACK_AGMARKNET_PRICES } = require('../services/agmarknetService');

/**
 * GET /api/market
 * Query parameters: crop, state, district, sort, limit
 */
exports.getMarketPrices = async (req, res, next) => {
  try {
    const { crop, state, district, sort, limit = 5000 } = req.query;

    const filterObj = {};
    if (state && state !== 'All') filterObj.state = state;
    if (district && district !== 'All') filterObj.district = district;
    if (crop) filterObj.commodity = crop;

    const { data: rawPrices, isLive, source, error } = await fetchAgmarknetPricesFromDataGov(filterObj);

    let filtered = [...rawPrices];

    // Client-side / local filter refinement
    if (crop) {
      const q = crop.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.cropName.toLowerCase().includes(q) ||
          item.variety.toLowerCase().includes(q) ||
          item.mandiName.toLowerCase().includes(q)
      );
    }

    if (state && state !== 'All') {
      filtered = filtered.filter(
        (item) => item.state.toLowerCase() === state.toLowerCase()
      );
    }

    if (district && district !== 'All') {
      filtered = filtered.filter(
        (item) => item.district.toLowerCase().includes(district.toLowerCase())
      );
    }

    // Sorting
    if (sort === 'price_desc') {
      filtered.sort((a, b) => b.modalPriceQuintal - a.modalPriceQuintal);
    } else if (sort === 'price_asc') {
      filtered.sort((a, b) => a.modalPriceQuintal - b.modalPriceQuintal);
    } else if (sort === 'gainers') {
      filtered.sort((a, b) => (b.priceTrend === 'Up' ? 1 : -1));
    }

    const limited = limit === 'all' ? filtered : filtered.slice(0, parseInt(limit, 10) || 5000);

    // Compute Market KPIs
    const totalCount = filtered.length;
    const avgModalPrice =
      totalCount > 0
        ? Math.round(
            filtered.reduce((acc, curr) => acc + curr.modalPriceQuintal, 0) / totalCount
          )
        : 0;

    const uniqueStates = [...new Set(rawPrices.map((p) => p.state))].sort();
    const uniqueDistricts = [...new Set(rawPrices.map((p) => p.district))].filter(Boolean).sort();
    const uniqueCommodities = [...new Set(rawPrices.map((p) => p.cropName))].sort();

    res.status(200).json({
      success: true,
      count: limited.length,
      totalAvailable: totalCount,
      isLive,
      source: isLive ? 'data.gov.in (Agmarknet Live)' : 'Agmarknet Certified Dataset',
      lastUpdated: new Date().toISOString(),
      kpis: {
        avgModalPrice,
        reportingMandis: totalCount,
        topCommodity: filtered[0]?.cropName || 'Cotton',
        topMandi: filtered[0]?.mandiName || 'Warangal Market Yard',
      },
      filters: {
        states: ['All', ...uniqueStates],
        districts: ['All', ...uniqueDistricts],
        commodities: uniqueCommodities,
      },
      prices: limited,
      apiNotice: error ? `Fallback active: ${error}` : undefined,
    });
  } catch (error) {
    next(error);
  }
};
