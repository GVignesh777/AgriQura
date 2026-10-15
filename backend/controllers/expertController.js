const ExpertQuery = require('../database/models/ExpertQuery');
const Farmer = require('../database/models/Farmer');

exports.createExpertQuery = async (req, res, next) => {
  try {
    const { queryTitle, queryDescription, cropName, images, aiPreviousAnalysis } = req.body;
    const farmer = await Farmer.findOne({ user: req.user.id });

    const query = await ExpertQuery.create({
      farmer: farmer?._id || req.user.id,
      queryTitle,
      queryDescription,
      cropName: cropName || 'General',
      images: images || [],
      aiPreviousAnalysis: aiPreviousAnalysis || '',
      status: 'Open',
    });

    res.status(201).json({
      success: true,
      message: 'Query escalated to agricultural expert. An expert will respond shortly.',
      query,
    });
  } catch (error) {
    next(error);
  }
};

exports.getExpertQueries = async (req, res, next) => {
  try {
    let queries;
    if (req.user.role === 'Expert' || req.user.role === 'Admin') {
      queries = await ExpertQuery.find().populate('farmer').sort({ createdAt: -1 });
    } else {
      const farmer = await Farmer.findOne({ user: req.user.id });
      queries = await ExpertQuery.find({ farmer: farmer?._id || req.user.id }).sort({ createdAt: -1 });
    }
    res.status(200).json({ success: true, count: queries.length, queries });
  } catch (error) {
    next(error);
  }
};

exports.respondToQuery = async (req, res, next) => {
  try {
    const { advice, prescriptions } = req.body;
    const query = await ExpertQuery.findById(req.params.id);

    if (!query) return res.status(404).json({ success: false, error: 'Query not found' });

    query.expert = req.user.id;
    query.status = 'Resolved';
    query.expertResponse = {
      advice,
      prescriptions: prescriptions || [],
      respondedAt: new Date(),
    };
    await query.save();

    res.status(200).json({ success: true, message: 'Response submitted to farmer', query });
  } catch (error) {
    next(error);
  }
};
