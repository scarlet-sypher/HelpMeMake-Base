const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../../Model/User');

const googleStrategy = new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const googleId = profile.id;
    
    console.log('Google OAuth Profile:', {
      id: profile.id,
      email: email,
      displayName: profile.displayName
    });
    
    // Step 1: Check if user exists by googleId
    let user = await User.findOne({ googleId });
   
    if (user) {
      // User exists with this Google ID, just return them
      console.log('Existing user found by Google ID:', user.email);
      return done(null, user);
    }
    
    // Step 2: Check if user exists by email
    user = await User.findOne({ email });
   
    if (user) {
      // User exists with same email but different provider
      // Update their Google ID and log them in
      console.log('Existing user found by email, linking Google account:', email);
      user.googleId = googleId;
      user.name = user.name || profile.displayName;
      user.avatar = user.avatar ;
      user.isEmailVerified = true;
      user.isAccountActive = true;
     
      await user.save();
      return done(null, user);
    }
    
    // Step 3: Create new user if none exists
    console.log('Creating new user with Google OAuth:', email);
    
    try {
      user = new User({
        googleId,
        email,
        name: profile.displayName,
        avatar: profile.photos[0]?.value,
        authProvider: 'google',
        isEmailVerified: true,
        isAccountActive: true,
        role: null
      });
     
      await user.save();
      console.log('New user created successfully:', user.email);
      return done(null, user);
     
    } catch (error) {
      // Handle duplicate key error gracefully
      if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
        // Another user was created with same email between our checks
        // This is a race condition - redirect to user-exists page
        console.log('Race condition: User already exists with email:', email);
        const err = new Error('USER_EXISTS');
        err.email = email;
        return done(err, null);
      }
      throw error; // Re-throw other errors
    }
  } catch (error) {
    console.error('Google Strategy Error:', error);
    return done(error, null);
  }
});

module.exports = googleStrategy;