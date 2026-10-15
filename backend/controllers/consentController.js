const ConsentRecord = require('../database/models/ConsentRecord');
const Farmer = require('../database/models/Farmer');

exports.recordConsent = async (req, res, next) => {
  try {
    const { consentType, isGranted } = req.body;

    const record = await ConsentRecord.create({
      user: req.user.id,
      consentType: consentType || 'DataPrivacy',
      isGranted: isGranted !== undefined ? isGranted : true,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] || '',
    });

    if (consentType === 'DataPrivacy' && isGranted) {
      await Farmer.findOneAndUpdate(
        { user: req.user.id },
        { consentAgreed: true, consentAgreedAt: new Date() }
      );
    }

    res.status(201).json({ success: true, message: 'Consent recorded successfully', record });
  } catch (error) {
    next(error);
  }
};
