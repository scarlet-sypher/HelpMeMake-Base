const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../../Model/User');

const githubStrategy = new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${process.env.SERVER_URL}/auth/github/callback`,
  scope: ['user:email']
}, async (accessToken, refreshToken, profile, done) => {
  try {

    console.log('GitHub Profile:', profile);
    
    
    const githubId = profile.id;
    const email = profile.emails && profile.emails.length > 0 
      ? profile.emails.find(email => email.primary)?.value || profile.emails[0].value 
      : null;
    const name = profile.displayName || profile.username;
    const avatar = profile.photos && profile.photos.length > 0 
      ? profile.photos[0].value 
      : null;

    if (!email) {
      return done(new Error('No email found in GitHub profile'), null);
    }


    let user = await User.findOne({ email });

    if (user) {
      
      if (!user.githubId) {
        user.githubId = githubId;
        user.authProvider = 'github';
        if (!user.name && name) user.name = name;
        if (!user.avatar && avatar) user.avatar = avatar;
        user.isEmailVerified = true;
        await user.save();
      }
    } 
    else {

      user = new User({
        email,
        githubId,
        name,
        avatar,
        authProvider: 'github',
        isEmailVerified: true,
        role: null 
      });
      await user.save();
    }

    return done(null, user);
  } catch (error) {
    console.error('GitHub Strategy Error:', error);
    return done(error, null);
  }
});

module.exports = githubStrategy;