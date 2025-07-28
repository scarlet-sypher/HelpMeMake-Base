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

    const existingUser = await User.findOne({ email });

    const user = await User.findOneAndUpdate(
      { githubId }, // match by githubId
      {
        githubId,
        email,
        name,
        avatar,
        authProvider: 'github',
        isEmailVerified: true,
        isAccountActive: true,
        role: existingUser?.role || null
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return done(null, user);
  } catch (error) {
    console.error('GitHub Strategy Error:', error);
    return done(error, null);
  }
});

module.exports = githubStrategy;
