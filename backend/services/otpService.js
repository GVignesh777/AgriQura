const crypto = require('crypto');
const bcrypt = require('bcryptjs');

/**
 * Generate 6-digit numeric OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Hash OTP code for secure DB storage
 */
const hashOTP = async (otpCode) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(otpCode, salt);
};

/**
 * Verify plaintext OTP against hashed OTP
 */
const verifyOTP = async (enteredOTP, hashedOTP) => {
  if (!enteredOTP || !hashedOTP) return false;
  return await bcrypt.compare(enteredOTP, hashedOTP);
};

module.exports = {
  generateOTP,
  hashOTP,
  verifyOTP,
};
