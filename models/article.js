const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ArticleSchema = new Schema(
  {
    user: {type: String},            
    title: {type: String},
    content: { type: String },
    length: { type: String },
    excerpt: { type: String },
    byline: { type: String },
    dir: { type: String },
    tags: { type: Array },     
    url: { type : String },
    image: { type : String },

  },
  { 
    timestamps: true, 
  }
);

module.exports = mongoose.model('Article', ArticleSchema);

