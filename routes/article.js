const express = require('express');
const jsdom = require("jsdom");
const passport = require('passport');
const readability = require('../utils/readability/index');

const router  = express.Router();
const { JSDOM } = jsdom;
const Readability = readability.Readability;
const JSDOMParser = readability.JSDOMParser;

var Article = require('../models/article');

router.post('/', (req, res, next) => {
  
  JSDOM.fromURL(req.body.url, {}).then(dom => {
    const document = dom.window.document;
    var scrapedArticle = new Readability(document).parse();

    const article = new Article(scrapedArticle);
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

// router.get('/', function(req, res, next) {
//   passport.authenticate('google-token', function(err, user, info) {
//     console.log(err, user, info);
//     if (err) { return next(err); }
//     if (!user) { return res.redirect('/login'); }
//     req.logIn(user, function(err) {
//       if (err) { return next(err); }
//       return res.redirect('/users/' + user.username);
//     });
//   })(req, res, next);
// });

// router.get('/', (req, res, next) => {
// router.get('/', passport.authenticate('google-token', {session: false}), (req, res, next) => {
// router.get('/', (req, res, next) => {

router.get('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {        
  Article.find({}, 'title content length excerpt', function (err, articles) {
    if (err) {
      res.status(500).send(err)
    }    
    res.send({ articles });
  });
});

router.get('/:id', (req, res, next) => {  
  Article.findOne({_id: req.params.id}, 'title content length', function (err, article) {
    if (err) {
      res.status(500).send(err)
    }    
    res.send({ article });
  });
});


module.exports = router;