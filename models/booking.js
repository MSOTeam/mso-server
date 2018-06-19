const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BookingSchema = new Schema(
  {            
    shopper: {type: String},
    client: { type: String },
    from: { type: String },
    to: { type: String },
    price: { type: Number },
    location: { type: String },     
  }, 
  { 
    timestamps: true, 
  }
);

module.exports = mongoose.model('Booking', BookingSchema);

