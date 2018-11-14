const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TagSchema = new Schema(
  {
    user: {type: String, required: true}, 
    tag: { type: String },
  },
  { 
    timestamps: true, 
  }
);

TagSchema.index({ user: 1, tag: 1 }, { unique: true })

module.exports = mongoose.model('Tag', TagSchema);

