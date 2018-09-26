const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {        
    email: {
      type: String, required: true,
      trim: true, unique: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    googleProvider: {
        type: {
            id: String,
            token: String
        },
        select: false
    },
    facebookProvider: {
        type: {
            id: String,
            token: String
        },
        select: false
    },
    password: {type: String},    
    first_name: {type: String, max: 100},
    last_name: {type: String, max: 100},    
  }, 
  { 
    timestamps: true, 
  }
);


UserSchema.statics.upsertGoogleUser = function(accessToken, refreshToken, profile, cb) {
    
    return this.findOne({
        'googleProvider.id': profile.id
    }, (err, user) => {
        
        if (!user) {
            // no google user was found, check email    
            this.findOne({'email': profile.emails[0].value})
             .then((user) => {
               // update if user email exists, else create
                if(user) {
                    const googleProvider = { 
                        id: profile.id,
                        token: accessToken 
                    };
                    this.findOneAndUpdate({'email': profile.emails[0].value}, { googleProvider })
                     .then((updatedUser) => cb(null, updatedUser))
                     .catch((error) => cb(error, {}))                     
                } else {
                     var newUser = new this({
                        fullName: profile.displayName,
                        email: profile.emails[0].value,
                        googleProvider: {
                            id: profile.id,
                            token: accessToken
                        }
                    });

                    newUser.save((error, savedUser) => {
                        if (error) {
                            console.log(error);
                        }
                        return cb(error, savedUser);
                    });        
                }
              })
              .catch((error) => cb(error, {}));        

        } else {
            return cb(err, user);
        }
    });
};

UserSchema.statics.upsertFbUser = function(accessToken, refreshToken, profile, cb) {
    
    return this.findOne({
        'facebookProvider.id': profile.id
    }, (err, user) => {
        // no user was found, check email
        if (!user) {
            this.findOne({'email': profile.emails[0].value})
            .then((user) => {
               // update if user email exists, else create
               if(user) {
                   const facebookProvider = { 
                      id: profile.id,
                      token: accessToken
                   };
                   this.findOneAndUpdate({'email': profile.emails[0].value}, { facebookProvider })
                    .then((updatedUser) => cb(null, updatedUser))
                    .catch((error) => cb(error, {}))                     
               } else {
                   var newUser = new this({
                        fullName: profile.displayName,
                        email: profile.emails[0].value,
                        facebookProvider: {
                            id: profile.id,
                            token: accessToken
                        }
                   });

                   newUser.save((error, savedUser) => {
                       if (error) {
                           console.log(error);
                       }
                       return cb(error, savedUser);
                   });        
               }
             })
             .catch((error) => cb(error, {}));      

        } else {
            return cb(err, user);
        }
    });
};

UserSchema.pre('save', function save(next) {
    const client = this;    
    if (!client.isModified('password')) { return next(); }
    bcrypt.genSalt(10, (err, salt) => {
      if (err) { return next(err); }
      bcrypt.hash(client.password, salt, null, (err, hash) => {
        if (err) { return next(err); }
        client.password = hash;
        next();
      });
    });
});

UserSchema.methods.comparePassword = (candidatePassword, cb) => {  
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {    
    cb(err, isMatch);
  });
};


UserSchema.set('toJSON', {getters: true, virtuals: true});

module.exports = mongoose.model('User', UserSchema);