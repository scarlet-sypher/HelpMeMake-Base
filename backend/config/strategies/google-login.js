const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../../Model/User");

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
    scope: ["profile", "email"],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const googleId = profile.id;

      console.log("Google OAuth Profile:", {
        id: profile.id,
        email: email,
        displayName: profile.displayName,
      });

      let user = await User.findOne({ googleId });

      if (user) {
        console.log("Existing user found by Google ID:", user.email);
        return done(null, user);
      }

      user = await User.findOne({ email });

      if (user) {
        console.log(
          "Existing user found by email, linking Google account:",
          email
        );
        user.googleId = googleId;
        user.name = user.name || profile.displayName;
        user.avatar = user.avatar;
        user.isEmailVerified = true;
        user.isAccountActive = true;

        await user.save();
        return done(null, user);
      }

      console.log("Creating new user with Google OAuth:", email);

      try {
        const crypto = require("crypto");
        const bcrypt = require("bcryptjs");
        const generatedPassword = crypto.randomBytes(8).toString("base64");
        const hashedPassword = await bcrypt.hash(generatedPassword, 12);

        user = new User({
          googleId,
          email,
          name: profile.displayName,
          avatar: profile.photos[0]?.value,
          authProvider: "google",
          password: hashedPassword,
          isEmailVerified: true,
          isAccountActive: true,
          tempPassword: generatedPassword,
          isPasswordUpdated: false,
          role: null,
        });

        await user.save();

        user.tempGeneratedPassword = generatedPassword;
        console.log("Set tempGeneratedPassword:", generatedPassword);

        console.log("New user created successfully:", user.email);
        return done(null, user);
      } catch (error) {
        if (
          error.code === 11000 &&
          error.keyPattern &&
          error.keyPattern.email
        ) {
          console.log("Race condition: User already exists with email:", email);
          const err = new Error("USER_EXISTS");
          err.email = email;
          return done(err, null);
        }
        throw error;
      }
    } catch (error) {
      console.error("Google Strategy Error:", error);
      return done(error, null);
    }
  }
);

module.exports = googleStrategy;
