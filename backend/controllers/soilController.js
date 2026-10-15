const SoilReport = require('../database/models/SoilReport');
const Farmer = require('../database/models/Farmer');

exports.analyzeSoil = async (req, res, next) => {
  try {
    const { phLevel, nitrogenRatio, phosphorusRatio, potassiumRatio, organicCarbonPercent, soilType } = req.body;
    const farmer = await Farmer.findOne({ user: req.user.id });

    const deficiencies = [];
    if (phLevel < 6.0) deficiencies.push('Acidic Soil (Low pH) — requires Lime drenching');
    if (phLevel > 7.8) deficiencies.push('Alkaline Soil (High pH) — requires Gypsum treatment');
    if (nitrogenRatio < 180) deficiencies.push('Nitrogen Deficiency — yellowing of leaves');
    if (phosphorusRatio < 20) deficiencies.push('Phosphorus Deficiency — stunted root development');
    if (potassiumRatio < 150) deficiencies.push('Potassium Deficiency — weak stems and low drought tolerance');

    const SuitableCrops = phLevel >= 6.0 && phLevel <= 7.5 ? ['Cotton', 'Paddy', 'Chilli', 'Groundnut', 'Maize'] : ['Paddy', 'Sorghum'];

    const report = await SoilReport.create({
      farmer: farmer?._id || req.user.id,
      phLevel: phLevel || 6.5,
      nitrogenRatio: nitrogenRatio || 160,
      phosphorusRatio: phosphorusRatio || 24,
      potassiumRatio: potassiumRatio || 180,
      organicCarbonPercent: organicCarbonPercent || 0.55,
      soilType: soilType || 'Black Soil',
      aiAnalysis: {
        deficiencies,
        suitableCrops: SuitableCrops,
        fertilizerDosage: [
          'Apply 50kg Neem-coated Urea per acre in split doses during Vegetative stage',
          'Apply 25kg Single Super Phosphate (SSP) at sowing time',
          'Apply 15kg Muriate of Potash (MOP) per acre'
        ],
        improvementPlan: 'Incorporate 5 tonnes/acre of well-decomposed Farm Yard Manure (FYM) to improve organic carbon content.'
      }
    });

    res.status(201).json({ success: true, report });
  } catch (error) {
    next(error);
  }
};

exports.getReports = async (req, res, next) => {
  try {
    const farmer = await Farmer.findOne({ user: req.user.id });
    if (!farmer) return res.status(200).json({ success: true, reports: [] });

    const reports = await SoilReport.find({ farmer: farmer._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: reports.length, reports });
  } catch (error) {
    next(error);
  }
};
