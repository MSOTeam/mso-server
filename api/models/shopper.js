var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ShopperSchema = new Schema(
  {
    first_name: {type: String, required: true, max: 100},
    last_name: {type: String, required: true, max: 100},    
    email: {type: String, required: true, max: 100},
    // location
    price: {type: Number},
    about: {type: String},
    instagram: {type: String},    
    // styles: {type: []},
    // assists_with:
    //availability     
  }
);

module.exports = mongoose.model('Shopper', ShopperSchema);