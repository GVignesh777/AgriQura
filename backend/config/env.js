const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const requiredVars = ['PORT', 'MONGODB_URI', 'JWT_SECRET'];

function validateEnv() {
  const missing = requiredVars.filter((varName) => !process.env[varName]);
  if (missing.length > 0) {
    console.error(`❌ [ENV ERROR] Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
}

module.exports = {
  validateEnv,
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '30d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3377',
  groqApiKey: process.env.GROQ_API_KEY || '',
  groqFastModel: process.env.GROQ_FAST_MODEL || 'llama-3.1-8b-instant',
  groqStrongModel: process.env.GROQ_STRONG_MODEL || 'llama-3.3-70b-versatile',
  smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
  smtpPort: process.env.SMTP_PORT || 587,
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  emailjsServiceId: process.env.EMAILJS_SERVICE_ID || '',
  emailjsPublicKey: process.env.EMAILJS_PUBLIC_KEY || '',
  emailjsPrivateKey: process.env.EMAILJS_PRIVATE_KEY || '',
  emailjsOtpTemplateId: process.env.EMAILJS_TEMPLATE_ID_OTP || '',
  emailjsAlertTemplateId: process.env.EMAILJS_TEMPLATE_ID_ALERT || '',

  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  openweatherApiKey: process.env.OPENWEATHER_API_KEY || '',
  dataGovApiKey: process.env.DATA_GOV_API_KEY || process.env.AGMARKNET_API_KEY || '',

  // Voice TTS & Intelligence Services
  sarvamApiKey: process.env.SARVAM_API_KEY || '',
  sarvamSpeaker: process.env.SARVAM_SPEAKER || 'priya',
  elevenlabsApiKey: process.env.ELEVENLABS_API_KEY || process.env.ELEVEN_LABS_API_KEY || '',
  elevenlabsVoiceId: process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM' // Rachel / standard multilingual
};
