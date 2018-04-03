var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

var Client = require('../models/client');

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
    return Client.findOne({email})
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