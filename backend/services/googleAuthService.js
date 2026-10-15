const { OAuth2Client } = require('google-auth-library');
const env = require('../config/env');

const client = new OAuth2Client(env.googleClientId);

/**
 * Verify Google ID Token server-side
 */
const verifyGoogleToken = async (idToken) => {
  try {
    if (!idToken) {
      return { success: false, error: 'No ID token provided' };
    }
    if (!env.googleClientId) {
      console.error('❌ [Google Auth Error]: GOOGLE_CLIENT_ID missing in backend environment.');
      return { success: false, error: 'Google OAuth Client ID is not configured on the server.' };
    }
    const ticket = await client.verifyIdToken({
      idToken,
      audience: env.googleClientId,
    });
    const payload = ticket.getPayload();
    return {
      success: true,
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };
  } catch (error) {
    console.error('❌ [Google OAuth Error]:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  verifyGoogleToken,
};
