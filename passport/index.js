var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

var Client = require('../models/client');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, 
function (email, password, cb) {

    return Client.findOne({email, password})
       .then(user => {
           if (!user) {
               return cb(null, false, {message: 'Incorrect email or password.'});
           }

           return cb(null, user, {message: 'Logged In Successfully'});
      })
      .catch(err => cb(err));
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