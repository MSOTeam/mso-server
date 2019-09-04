const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ArticleSchema = new Schema(
  {
    user: { type: String, required: true },
    title: { type: String },
    content: { type: String },
    length: { type: String },
    excerpt: { type: String },
    byline: { type: String },
    dir: { type: String },
    tags: { type: Array },
    url: { type : String, required: true },
    image: { type : String },
    length: { type : Number },
  },
  {
    timestamps: true,
  }
);

ArticleSchema.index({ "content": "text", "title": "text", "tags": "text" });

ArticleSchema.index({ user: 1, url: 1 }, { unique: true });

module.exports = mongoose.model('Article', ArticleSchema);

