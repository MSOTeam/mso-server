const express = require('express');
const jsdom = require("jsdom");
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

router.get('/', (req, res, next) => {
  Article.find({}, 'title content length', function (err, articles) {
    if (err) {
      res.status(500).send(err)
    }
    // console.log(shoppers);
    res.send({ articles });
  });
});

module.exports = router;