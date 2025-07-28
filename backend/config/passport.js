const passport = require('passport');
const googleStrategy = require('./strategies/google-login');
const jwtStrategy = require('./strategies/jwt');

//comming soon
passport.use('google', googleStrategy);
passport.use('jwt', jwtStrategy);



module.exports = passport ;