const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../../Model/User');

const googleStrategy = new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.SERVER_URL}/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;

    const existingUser = await User.findOne({ email });

    const user = await User.findOneAndUpdate(
      { googleId: profile.id }, 
      {
        googleId: profile.id,
        email: email,
        name: profile.displayName,
        avatar: profile.photos[0]?.value,
        authProvider: 'google',
        isEmailVerified: true,
        isAccountActive: true,
        role: existingUser?.role || null 
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return done(null, user);
  } catch (error) {
    console.error('Google Strategy Error:', error);
    return done(error, null);
  }
});

module.exports = googleStrategy;
