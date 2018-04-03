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
      city: {type: String},
      price: {type: Number},
      about: {type: String},
      instagram: {type: String},    
      styles: {type: []},
      assists_with: {type: []},
      calendar: {type: []},
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