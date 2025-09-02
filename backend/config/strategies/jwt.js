const JwtStrategy = require("passport-jwt").Strategy;
const User = require("../../Model/User");

const cookieExtractor = (req) => {
  let token = null;

  //Authorization header
  if (req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  if (!token && req && req.cookies && req.cookies.access_token) {
    token = req.cookies.access_token;
  }

  return token;
};

const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET,
    passReqToCallback: true,
  },
  async (req, payload, done) => {
    try {
      const user = await User.findById(payload.userId).select("-password");

      if (!user) {
        return done(null, false, { message: "User not found" });
      }

      return done(null, user);
    } catch (error) {
      console.error("JWT Strategy Error:", error);
      return done(error, false);
    }
  }
);

module.exports = jwtStrategy;
