var mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');

var Schema = mongoose.Schema;

var ShopperSchema = new Schema(
  {
    email: {type: String, unique: true},    
    password: {type: String},
    facebook: { type: String },
    google: { type: String },
    profile: {
      first_name: {type: String, max: 100},
      last_name: {type: String, max: 100},    
      locations: {type: []},
      languages: {type: []},
      years_experience: {type: Number},
      about: {type: String},
      hashtags: {type: []},
      styles: {type: []},
      training: {type: []},
      assists_with: {type: []},
      store_types: {type: []},
      hourly_price: {type: Number},
      availability: {type: []},      
      instagram: {type: String},
      pinterest: {type: String},                      
    },
  },
  { 
    timestamps: true, 
  }
);

ShopperSchema.pre('save', function save(next) {
  const user = this;    
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

ShopperSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {  
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {    
    cb(err, isMatch);
  });
};

module.exports = mongoose.model('Shopper', ShopperSchema);