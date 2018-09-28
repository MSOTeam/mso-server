const passport = require('passport');
const GoogleTokenStrategy = require('passport-google-token').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const User = require('../models/user');
const config = require('../config/auth');


passport.use(new GoogleTokenStrategy({
        clientID: config.googleAuth.clientID,
        clientSecret: config.googleAuth.clientSecret
    },
    function (accessToken, refreshToken, profile, done) {
        User.upsertGoogleUser(accessToken, refreshToken, profile, function(err, user) {
            return done(err, user);
        });
    }
));

passport.use(new FacebookTokenStrategy({
    clientID: config.facebookAuth.clientID,
    clientSecret: config.facebookAuth.clientSecret
},
function (accessToken, refreshToken, profile, done) {
    User.upsertFbUser(accessToken, refreshToken, profile, function(err, user) {
        return done(err, user);
    });
}));


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
    return User.findOne({ email })
       .then(user => {
           if (!user) {
              return done(null, false, {message: 'Incorrect email or password.'});
           }
           user.comparePassword(password, (err, isMatch) => {
            if (err) { return done(err); }
            if (isMatch) {
                return done(null, user, {message: 'Logged In Successfully'});
            }
            return done(null, false, { message: 'Invalid email or password.' });
           });
      })
      .catch(err => done(err));
    }
));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'tagit',
},
function (jwtPayload, cb) {
    
    return User.findOneById(jwtPayload.id)
        .then(user => {
            return cb(null, user);
        })
        .catch(err => {
            return cb(err);
        });
}
));