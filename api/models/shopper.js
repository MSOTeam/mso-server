var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ShopperSchema = new Schema(
  {
    first_name: {type: String, required: true, max: 100},
    last_name: {type: String, required: true, max: 100},
    date_of_birth: {type: Date},    
  }
);

module.exports = mongoose.model('Shopper', ShopperSchema);