const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../database/models/User');
const Farmer = require('../database/models/Farmer');
const { generateOTP, hashOTP, verifyOTP } = require('../services/otpService');
const { sendOTPEmail } = require('../services/emailService');
const { verifyGoogleToken } = require('../services/googleAuthService');

// Helper to generate JWT token
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = jwt.sign({ id: user._id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpire,
  });

  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
      preferredLanguage: user.preferredLanguage,
    },
  });
};

/**
 * @desc    Register user & send EmailJS OTP
 * @route   POST /api/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role, preferredLanguage, state, district } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide name, email, and password' });
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    if (user && user.isVerified) {
      return res.status(400).json({ success: false, error: 'Email already registered and verified' });
    }

    // Generate 6-digit OTP
    const rawOTP = generateOTP();
    const hashedOTP = await hashOTP(rawOTP);
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const otpCooldown = new Date(Date.now() + 45 * 1000); // 45 seconds cooldown

    if (!user) {
      user = await User.create({
        name,
        email: email.toLowerCase(),
        phone: phone || '',
        password,
        role: role || 'Farmer',
        preferredLanguage: preferredLanguage || 'en',
        isVerified: false,
        otpHash: hashedOTP,
        otpExpire,
        otpCooldown,
      });

      // Create linked Farmer profile if role is Farmer
      if (user.role === 'Farmer') {
        await Farmer.create({
          user: user._id,
          state: state || 'Telangana',
          district: district || 'Warangal',
        });
      }
    } else {
      // Re-send OTP for unverified account
      user.name = name;
      user.password = password;
      user.otpHash = hashedOTP;
      user.otpExpire = otpExpire;
      user.otpCooldown = otpCooldown;
      await user.save();
    }

    // Send OTP email via EmailJS (agriqura@gmail.com)
    await sendOTPEmail(user.email, rawOTP, user.name);

    res.status(201).json({
      success: true,
      message: 'Verification OTP sent to your email address',
      email: user.email,
      requiresOtp: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify OTP & activate account
 * @route   POST /api/auth/verify-otp
 */
exports.verifyUserOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, error: 'Please provide email and OTP code' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+otpHash +otpExpire');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User account not found' });
    }

    if (user.otpExpire && user.otpExpire < new Date()) {
      return res.status(400).json({ success: false, error: 'OTP has expired. Please request a new one.' });
    }

    const isMatch = await verifyOTP(otp, user.otpHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Invalid OTP code entered' });
    }

    user.isVerified = true;
    user.otpHash = undefined;
    user.otpExpire = undefined;
    user.otpCooldown = undefined;
    await user.save();

    sendTokenResponse(user, 200, res, 'Account successfully verified!');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Resend OTP code
 * @route   POST /api/auth/resend-otp
 */
exports.resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Please provide email' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+otpCooldown');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (user.otpCooldown && user.otpCooldown > new Date()) {
      const waitSecs = Math.ceil((user.otpCooldown - new Date()) / 1000);
      return res.status(429).json({
        success: false,
        error: `Please wait ${waitSecs} seconds before requesting another OTP`,
      });
    }

    const rawOTP = generateOTP();
    user.otpHash = await hashOTP(rawOTP);
    user.otpExpire = new Date(Date.now() + 10 * 60 * 1000);
    user.otpCooldown = new Date(Date.now() + 45 * 1000);
    await user.save();

    await sendOTPEmail(user.email, rawOTP, user.name);

    res.status(200).json({
      success: true,
      message: 'New OTP code sent to your email address',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login with Email + Password
 * @route   POST /api/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    if (!user.password) {
      return res.status(401).json({
        success: false,
        error: 'This account was created with Google Sign-In. Please log in using Google.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      // Send OTP again for verification
      const rawOTP = generateOTP();
      user.otpHash = await hashOTP(rawOTP);
      user.otpExpire = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();
      await sendOTPEmail(user.email, rawOTP, user.name);

      return res.status(403).json({
        success: false,
        requiresOtp: true,
        error: 'Account not verified. Verification code has been sent to your email.',
      });
    }

    sendTokenResponse(user, 200, res, 'Logged in successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Google Sign-In OAuth 2.0
 * @route   POST /api/auth/google
 */
exports.googleAuth = async (req, res, next) => {
  try {
    const { role, state, district } = req.body;
    const idToken = req.body.idToken || req.body.token;

    if (!idToken) {
      return res.status(400).json({ success: false, error: 'Google ID Token is required' });
    }

    const googleUser = await verifyGoogleToken(idToken);

    if (!googleUser.success) {
      return res.status(401).json({ success: false, error: 'Invalid Google authentication token' });
    }

    let user = await User.findOne({ email: googleUser.email.toLowerCase() });

    if (!user) {
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email.toLowerCase(),
        googleId: googleUser.googleId,
        avatar: googleUser.picture || '',
        role: role || 'Farmer',
        isVerified: true, // Google accounts are pre-verified
      });

      if (user.role === 'Farmer') {
        await Farmer.create({
          user: user._id,
          state: state || 'Telangana',
          district: district || 'Warangal',
        });
      }
    } else {
      if (!user.googleId) {
        user.googleId = googleUser.googleId;
        user.isVerified = true;
        await user.save();
      }
    }

    sendTokenResponse(user, 200, res, 'Google Sign-In successful');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Current Logged in User
 * @route   GET /api/auth/me
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    let farmerProfile = null;

    if (user.role === 'Farmer') {
      farmerProfile = await Farmer.findOne({ user: user._id });
    }

    res.status(200).json({
      success: true,
      user,
      farmerProfile,
    });
  } catch (error) {
    next(error);
  }
};
