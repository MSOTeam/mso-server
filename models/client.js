var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ClientSchema = new Schema(
  {    
    // local: {
    //   email: {type: String, unique: true, max: 100},    
    //   password: {type: String},
    // },
    // facebook: {
    //   id: String,
    //   token: String,
    //   name: String,
    //   email: String
    // },
    email: {type: String, unique: true, max: 100},    
    password: {type: String},
    first_name: {type: String, required: true, max: 100},
    last_name: {type: String, required: true, max: 100},        
    looking_for: {type: []},
    styles: {type: []},
    budget: {type: Number},
    hours: {type: Number},
    meeting_point: {type: String},
    occupation: {type: String},
  }
);

module.exports = mongoose.model('Client', ClientSchema);