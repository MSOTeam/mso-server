const express = require('express');
const jsdom = require("jsdom");
const passport = require('passport');
const readability = require('../utils/readability/index');
var read = require('read-art');
const extractor = require('unfluff');

const router  = express.Router();
const { extract } = require('article-parser');

var Article = require('../models/article');

router.post('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  read(req.body.url, function(err, art, options, resp){
  if(err){
    throw err;
  }
  let url = req.body.url;

  extract(url).then((article) => {
    const art = new Article();
    art.user = req.user._id;
    art.title = article.title;
    art.content = article.content;
    art.tags = JSON.parse(req.body.tags);
    art.url = req.body.url;
    art.image = article.image;
    art.save(
      function (err) {       
        if (err) {        
          res.status(500).send(err);
        }
        res.send({ art });
      }
    );
  });
  })
return;
});

router.get('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {  
  Article.find({user: req.user._id}, 'image title content length excerpt tags', function (err, articles) {
    console.log(articles);
    
    if (err) {
      res.status(500).send(err)
    }    
    res.send({ articles });    
  });
});

router.get('/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {  
  Article.findOne({_id: req.params.id}, 'title content length tags image', function (err, article) {
    if (err) {
      res.status(500).send(err)
    }    
    res.send({ article });
  });
});


module.exports = router;