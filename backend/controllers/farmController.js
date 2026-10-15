const Farm = require('../database/models/Farm');
const Farmer = require('../database/models/Farmer');

exports.getFarms = async (req, res, next) => {
  try {
    const farmer = await Farmer.findOne({ user: req.user.id });
    if (!farmer) return res.status(200).json({ success: true, count: 0, farms: [] });

    const farms = await Farm.find({ farmer: farmer._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: farms.length, farms });
  } catch (error) {
    next(error);
  }
};

exports.addFarm = async (req, res, next) => {
  try {
    let farmer = await Farmer.findOne({ user: req.user.id });
    if (!farmer) {
      farmer = await Farmer.create({
        user: req.user.id,
        state: req.body.location?.state || 'Telangana',
        district: req.body.location?.district || 'Warangal',
      });
    }

    const farm = await Farm.create({
      farmer: farmer._id,
      farmName: req.body.farmName,
      location: req.body.location,
      areaAcres: req.body.areaAcres,
      crop: req.body.crop,
      variety: req.body.variety || 'Standard',
      sowingDate: req.body.sowingDate || new Date(),
      cropStage: req.body.cropStage || 'Vegetative',
      soilType: req.body.soilType || 'Loamy Soil',
      irrigationType: req.body.irrigationType || 'Drip',
      healthScore: 88,
    });

    res.status(201).json({ success: true, message: 'Farm added successfully', farm });
  } catch (error) {
    next(error);
  }
};

exports.updateFarm = async (req, res, next) => {
  try {
    const farm = await Farm.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!farm) return res.status(404).json({ success: false, error: 'Farm not found' });
    res.status(200).json({ success: true, message: 'Farm updated', farm });
  } catch (error) {
    next(error);
  }
};

exports.deleteFarm = async (req, res, next) => {
  try {
    const farm = await Farm.findByIdAndDelete(req.params.id);
    if (!farm) return res.status(404).json({ success: false, error: 'Farm not found' });
    res.status(200).json({ success: true, message: 'Farm deleted' });
  } catch (error) {
    next(error);
  }
};
