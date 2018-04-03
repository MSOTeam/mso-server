const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');

var Schema = mongoose.Schema;

var ClientSchema = new Schema(
  {        
    email: {type: String, unique: true, max: 100},    
    password: {type: String},
    facebook: { type: String },
    google: { type: String },
    profile: {
      first_name: {type: String, max: 100},
      last_name: {type: String, max: 100},        
      looking_for: {type: []},
      styles: {type: []},
      budget: {type: Number},
      hours: {type: Number},
      meeting_point: {type: String},
      occupation: {type: String},
    },
  }, 
  { 
    timestamps: true, 
  }
);

ClientSchema.pre('save', function save(next) {
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

ClientSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {  
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {    
    cb(err, isMatch);
  });
};

module.exports = mongoose.model('Client', ClientSchema);