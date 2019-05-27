const express = require('express');
const jsdom = require("jsdom");
const passport = require('passport');
const readability = require('../utils/readability/index');
var read = require('read-art');
const extractor = require('unfluff');


const router  = express.Router();
const { extract } = require('article-parser');

const Article = require('../models/article');
const Tag = require('../models/tag'); 

router.post('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  read(req.body.url, (err, art, options, resp) => {
    if(err) {
      res.status(500).send(err);
    }
    const url = req.body.url;
    
    const tags = [];
    JSON.parse(req.body.tags).forEach(tag => {
      tags.push({ user: req.user._id, tag });
    });

    Tag.create(tags, (err) => {
      if (err) {        
        // res.status(500).send(err);
        console.log(err);
      }
    });

    extract(url).then((article) => {
      const art = new Article();
      art.user = req.user._id;
      art.title = article.title;
      art.content = article.content;
      art.original = article.content;
      art.tags = JSON.parse(req.body.tags);
      art.url = url;
      art.image = article.image;
      art.length = article.duration;
      art.save(
        (err) => {       
          if (err) {        
            res.status(500).send(err);
          }
          res.send({ art });
          console.log(art);
        }
      );
    });
  });

  return;
});


router.put('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {

  Article.findByIdAndUpdate({ _id: req.body.id }, { $set: { content: req.body.content }}, (err, article) => {
    if (err) {
      res.status(500).send(err);
    }
    res.send({ article });
  });
});

router.get('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  
  const query = { user: req.user.id };

  if(req.query.tag) {
    query.tags = req.query.tag;
  }
  
  Article.find(query, 'image title content length excerpt tags createdAt', (err, articles) => {    
    if (err) {
      res.status(500).send(err)
    }    
    res.send({ articles });    
  }).sort( { createdAt: -1 } );
});

router.get('/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {  
  Article.findOne({_id: req.params.id}, 'title content length tags image url', (err, article) => {
    if (err) {
      res.status(500).send(err)
    }    
    res.send({ article });
  });
});

module.exports = router;