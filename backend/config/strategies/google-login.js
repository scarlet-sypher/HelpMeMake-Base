const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../../Model/User');

const googleStrategy = new GoogleStrategy({

  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.SERVER_URL}/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
  
  try {
    
    let user = await User.findOne({ googleId: profile.id });

    if (user) {
     
      return done(null, user);
    }

    
    user = await User.findOne({ email: profile.emails[0].value });

    if (user) {
      
      user.googleId = profile.id;
      user.authProvider = 'google';
      user.name = user.name || profile.displayName;
      user.avatar = user.avatar || profile.photos[0]?.value;
      user.isEmailVerified = true; 
      await user.save();
      return done(null, user);
    }

    
    const newUser = new User({
      googleId: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      avatar: profile.photos[0]?.value,
      authProvider: 'google',
      isEmailVerified: true,
      role: null 
    });

    await newUser.save();
    return done(null, newUser);

  } catch (error) {
    console.error('Google Strategy Error:', error);
    return done(error, null);
  }
});

module.exports = googleStrategy;