const express = require('express');
const jsdom = require("jsdom");
const passport = require('passport');
const readability = require('../utils/readability/index');

const router  = express.Router();
const { JSDOM } = jsdom;
const Readability = readability.Readability;
const JSDOMParser = readability.JSDOMParser;

var Article = require('../models/article');

router.post('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {    
  JSDOM.fromURL(req.body.url, {}).then(dom => {
    const document = dom.window.document;
    var scrapedArticle = new Readability(document).parse();

    const article = new Article(scrapedArticle);
    article.user = req.user._id;
    article.tags = JSON.parse(req.body.tags);
    article.url = req.body.url;
    
    article.save(
      function (err) {
        if (err) {        
          res.status(500).send(err);
        }
        res.send({ article });
      }
    );  
  });
});

router.get('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {  
  Article.find({user: req.user._id}, 'title content length excerpt tags createdAt url', function (err, articles) {
    if (err) {
      res.status(500).send(err)
    }    
    res.send({ articles });
  });
});

router.get('/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {  
  Article.findOne({_id: req.params.id}, 'title content length tags createdAt url', function (err, article) {
    if (err) {
      res.status(500).send(err)
    }    
    res.send({ article });
  });
});


module.exports = router;