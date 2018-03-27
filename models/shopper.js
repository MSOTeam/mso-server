var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ShopperSchema = new Schema(
  {
    auth_type: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    password: {type: String},
    first_name: {type: String, required: true, max: 100},
    last_name: {type: String, required: true, max: 100},    
    email: {type: String, required: true, max: 100},
    city: {type: String},
    price: {type: Number},
    about: {type: String},
    instagram: {type: String},    
    styles: {type: []},
    assists_with: {type: []},
    calendar: {type: []},
  }
);

module.exports = mongoose.model('Shopper', ShopperSchema);