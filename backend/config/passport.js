const passport = require('passport');
const googleStrategy = require('./strategies/google-login');
const jwtStrategy = require('./strategies/jwt');
const githubStrategy = require('./strategies/github-login');


passport.use('google', googleStrategy);
passport.use('jwt', jwtStrategy);
passport.use('github', githubStrategy);



module.exports = passport ;