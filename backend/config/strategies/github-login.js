const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../../Model/User");

const githubStrategy = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_URL}/auth/github/callback`,
    scope: ["user:email"],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const githubId = profile.id;
      const email =
        profile.emails?.find((e) => e.primary)?.value ||
        profile.emails?.[0]?.value ||
        null;
      const name = profile.displayName || profile.username;
      const avatar = profile.photos?.[0]?.value || null;

      if (!email) {
        return done(new Error("No email found in GitHub profile"), null);
      }

      let user = await User.findOne({ githubId });

      if (user) {
        return done(null, user);
      }

      user = await User.findOne({ email });

      if (user) {
        user.githubId = githubId;
        user.name = user.name || name;
        user.avatar = user.avatar || avatar;
        user.isEmailVerified = true;
        user.isAccountActive = true;

        await user.save();
        return done(null, user);
      }

      try {
        const crypto = require("crypto");
        const bcrypt = require("bcryptjs");
        const generatedPassword = crypto.randomBytes(8).toString("base64");
        const hashedPassword = await bcrypt.hash(generatedPassword, 12);

        user = new User({
          githubId,
          email,
          name,
          avatar,
          authProvider: "github",
          password: hashedPassword,
          isEmailVerified: true,
          isAccountActive: true,
          tempPassword: generatedPassword,
          isPasswordUpdated: false,
          role: null,
        });

        await user.save();

        const userWithTempPassword = user.toObject();
        userWithTempPassword.tempGeneratedPassword = generatedPassword;

        console.log("New GitHub user created with temp password for:", email);
        return done(null, userWithTempPassword);
      } catch (error) {
        if (
          error.code === 11000 &&
          error.keyPattern &&
          error.keyPattern.email
        ) {
          const err = new Error("USER_EXISTS");
          err.email = email;
          return done(err, null);
        }
        throw error;
      }
    } catch (error) {
      console.error("GitHub Strategy Error:", error);
      return done(error, null);
    }
  }
);

module.exports = githubStrategy;
