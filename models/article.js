const mongoose = require('mongoose');
const Tag = require('./tag');

var Schema = mongoose.Schema;

var ArticleSchema = new Schema(
  {
    user: {type: String, required: true},            
    title: {type: String},
    content: { type: String },
    length: { type: String },
    excerpt: { type: String },
    byline: { type: String },
    dir: { type: String },
    tags: { type: Array },
    url: { type: String },     
  },
  { 
    timestamps: true, 
  }
);

ArticleSchema.pre('save', (next) => {

  next();
  // const client = this;    
  // if (!client.isModified('password')) { return next(); }
  // bcrypt.genSalt(10, (err, salt) => {
  //   if (err) { return next(err); }
  //   bcrypt.hash(client.password, salt, null, (err, hash) => {
  //     if (err) { return next(err); }
  //     client.password = hash;
      
  //   });
  // });
});

module.exports = mongoose.model('Article', ArticleSchema);

