var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const OAuth2Strategy = require('passport-oauth2').Strategy;

var Client = require('../models/client');
var Shopper = require('../models/shopper');

passport.serializeUser((user, done) => {
  done(null, user.id);
});
  
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, 
function (email, password, done) {
    return Shopper.findOne({email})
       .then(user => {
           if (!user) {
               return done(null, false, {message: 'Incorrect email or password.'});
           }

           user.comparePassword(password, (err, isMatch) => {
            if (err) { return done(err); }
            if (isMatch) {
                return done(null, user, {message: 'Logged In Successfully'});
            }
            return done(null, false, { msg: 'Invalid email or password.' });
           });
      })
      .catch(err => done(err));
    }
));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'jwt_secret',
},
function (jwtPayload, cb) {
    
    return Client.findOneById(jwtPayload.id)
        .then(user => {
            return cb(null, user);
        })
        .catch(err => {
            return cb(err);
        });
}
));

passport.use(new OAuth2Strategy({
    authorizationURL: 'https://localhost:5000/auth/authorize',
    tokenURL: 'https://localhost:5000/auth/token',
    clientID: '317827366745-tkf2ndf7ujaeur4mu26bvi5u4l2ts6li.apps.googleusercontent.com ',
    clientSecret: 'gx5jJk7dNQdvgQJ9pgHQY15_',
    callbackURL: "http://localhost:5000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // User.findOrCreate({ exampleId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
  }
));