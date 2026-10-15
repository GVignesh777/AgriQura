const User = require('../database/models/User');
const Farmer = require('../database/models/Farmer');

exports.updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      preferredLanguage,
      avatar,
      state,
      district,
      subDistrict,
      village,
      landSizeAcres,
      soilType,
      irrigationSource,
      primaryCrops,
      experienceYears,
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (preferredLanguage) user.preferredLanguage = preferredLanguage;
    if (avatar) user.avatar = avatar;
    await user.save();

    let farmer = await Farmer.findOne({ user: user._id });
    if (farmer) {
      if (state) farmer.state = state;
      if (district) farmer.district = district;
      if (subDistrict) farmer.subDistrict = subDistrict;
      if (village) farmer.village = village;
      if (landSizeAcres !== undefined && landSizeAcres !== null) farmer.landSizeAcres = landSizeAcres;
      if (soilType) farmer.soilType = soilType;
      if (irrigationSource) farmer.irrigationSource = irrigationSource;
      if (primaryCrops) farmer.primaryCrops = primaryCrops;
      if (experienceYears !== undefined && experienceYears !== null) farmer.experienceYears = experienceYears;
      await farmer.save();
    }

    res.status(200).json({ success: true, message: 'Profile updated', user, farmer });
  } catch (error) {
    next(error);
  }
};
