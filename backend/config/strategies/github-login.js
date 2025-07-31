const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../../Model/User');

const githubStrategy = new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${process.env.SERVER_URL}/auth/github/callback`,
  scope: ['user:email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const githubId = profile.id;
    const email = profile.emails?.find(e => e.primary)?.value || profile.emails?.[0]?.value || null;
    const name = profile.displayName || profile.username;
    const avatar = profile.photos?.[0]?.value || null;

    if (!email) {
      return done(new Error('No email found in GitHub profile'), null);
    }

    // Step 1: Check if user exists by githubId
    let user = await User.findOne({ githubId });
    
    if (user) {
      // User exists with this GitHub ID, just return them
      return done(null, user);
    }

    // Step 2: Check if user exists by email
    user = await User.findOne({ email });
    
    if (user) {
      // User exists with same email but different provider
      // Update their GitHub ID and log them in
      user.githubId = githubId;
      user.name = user.name || name;
      user.avatar = user.avatar || avatar;
      user.isEmailVerified = true;
      user.isAccountActive = true;
      
      await user.save();
      return done(null, user);
    }

    // Step 3: Create new user if none exists
     try {
      // Generate random password for GitHub users
      const crypto = require('crypto');
      const bcrypt = require('bcryptjs');
      const generatedPassword = crypto.randomBytes(8).toString('base64');
      const hashedPassword = await bcrypt.hash(generatedPassword, 12);
      
      user = new User({
        githubId,
        email,
        name,
        avatar,
        authProvider: 'github',
        password: hashedPassword,  // Store hashed generated password
        isEmailVerified: true,
        isAccountActive: true,
        tempPassword: generatedPassword,
        isPasswordUpdated: false,  // Flag for password update prompt
        role: null
      });
      
      await user.save();
      
      // Store generated password temporarily for response
      user.tempGeneratedPassword = generatedPassword;
      console.log('Set tempGeneratedPassword:', generatedPassword);
      
      return done(null, user);
      
    } catch (error) {
      // Handle duplicate key error gracefully
      if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
        // Another user was created with same email between our checks
        // This is a race condition - redirect to user-exists page
        const err = new Error('USER_EXISTS');
        err.email = email;
        return done(err, null);
      }
      throw error; // Re-throw other errors
    }

  } catch (error) {
    console.error('GitHub Strategy Error:', error);
    return done(error, null);
  }
});

module.exports = githubStrategy;