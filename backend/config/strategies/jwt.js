const JwtStrategy = require('passport-jwt').Strategy;
const User = require('../../Model/User');


const cookieExtractor = (req) => {

  let token = null;
  if (req && req.cookies && req.cookies.access_token) {
    token = req.cookies.access_token;
  }
  

};

const jwtStrategy = new JwtStrategy({
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true
}, async (req, payload, done) => {
  try {


    const user = await User.findById(payload.userId).select('-password');
    
    if (!user) {
      return done(null, false, { message: 'User not found' });
    }



  } catch (error) {
    console.error('JWT Strategy Error:', error);
    return done(error, false);
  }
});

module.exports = jwtStrategy;