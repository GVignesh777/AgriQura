const cropsData = [
  {
    id: 'cotton',
    name: 'Cotton',
    category: 'Cash Crop',
    durationDays: 160,
    idealSoil: 'Black Cotton Soil / Deep Alluvial',
    waterReq: 'Moderate (700-1200 mm)',
    stages: [
      { name: 'Seedling', days: '1-25', advice: 'Maintain optimum soil moisture. Treat seed with Trichoderma.' },
      { name: 'Vegetative', days: '26-60', advice: 'Apply Nitrogen top dressing. Monitor for sucking pests like thrips and aphids.' },
      { name: 'Flowering & Square Formation', days: '61-100', advice: 'Critical stage for moisture. Spray Neem oil 10,000 ppm if whitefly observed.' },
      { name: 'Boll Development & Maturation', days: '101-160', advice: 'Stop irrigation 15 days prior to picking to avoid boll rot.' }
    ]
  },
  {
    id: 'paddy',
    name: 'Paddy / Rice',
    category: 'Cereal',
    durationDays: 120,
    idealSoil: 'Clayey Loam / Alluvial',
    waterReq: 'High (1200-1500 mm)',
    stages: [
      { name: 'Nursery & Transplanting', days: '1-25', advice: 'Transplant 2-3 seedlings per hill at 20x15 cm spacing.' },
      { name: 'Tillering', days: '26-50', advice: 'Maintain 2-5 cm standing water level. Apply Zinc Sulphate if yellowing occurs.' },
      { name: 'Panicle Initiation', days: '51-80', advice: 'Apply second dose of Nitrogen + Potash. Inspect for Stem Borer.' },
      { name: 'Grain Filling & Harvest', days: '81-120', advice: 'Drain water 10 days before harvest. Harvest when 80% grains turn golden yellow.' }
    ]
  },
  {
    id: 'chilli',
    name: 'Chilli',
    category: 'Spices',
    durationDays: 150,
    idealSoil: 'Well-drained Red / Black Loam',
    waterReq: 'Moderate (600-900 mm)',
    stages: [
      { name: 'Nursery', days: '1-35', advice: 'Drench nursery bed with Copper Oxychloride against damping off.' },
      { name: 'Transplanting', days: '36-60', advice: 'Apply FYM 10 tonnes/acre. Ensure raised bed planting for drainage.' },
      { name: 'Flowering', days: '61-100', advice: 'Spray Planofix to prevent flower drop. Monitor for Chilli Thrips (Leaf Curl).' },
      { name: 'Fruit Harvest', days: '101-150', advice: 'Pick fully ripe red fruits for dry chilli; green for fresh market.' }
    ]
  }
];

exports.getAllCrops = async (req, res, next) => {
  res.status(200).json({ success: true, count: cropsData.length, crops: cropsData });
};

exports.getCropById = async (req, res, next) => {
  const crop = cropsData.find((c) => c.id === req.params.id || c.name.toLowerCase() === req.params.id.toLowerCase());
  if (!crop) return res.status(404).json({ success: false, error: 'Crop advisory not found' });
  res.status(200).json({ success: true, crop });
};
