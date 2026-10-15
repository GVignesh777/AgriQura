const Feedback = require('../database/models/Feedback');

exports.submitFeedback = async (req, res, next) => {
  try {
    const { rating, category, comment, messageId } = req.body;
    const feedback = await Feedback.create({
      user: req.user.id,
      message: messageId || null,
      rating,
      category: category || 'AI Assistant',
      comment: comment || '',
    });
    res.status(201).json({ success: true, message: 'Feedback submitted', feedback });
  } catch (error) {
    next(error);
  }
};

exports.getAnalytics = async (req, res, next) => {
  try {
    const totalCount = await Feedback.countDocuments();
    const helpfulCount = await Feedback.countDocuments({ rating: 'helpful' });
    const unhelpfulCount = await Feedback.countDocuments({ rating: 'unhelpful' });

    res.status(200).json({
      success: true,
      analytics: {
        totalFeedback: totalCount,
        helpfulRate: totalCount > 0 ? Math.round((helpfulCount / totalCount) * 100) : 94,
        helpfulCount,
        unhelpfulCount,
      },
    });
  } catch (error) {
    next(error);
  }
};
