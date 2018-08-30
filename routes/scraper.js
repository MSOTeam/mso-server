const express = require('express');
const jsdom = require("jsdom");
const readability = require('../utils/readability/index');

const router  = express.Router();
const { JSDOM } = jsdom;
const Readability = readability.Readability;
const JSDOMParser = readability.JSDOMParser;

var Article = require('../models/article');

router.get('/', (req, res, next) => {

  const url = 'https://www.mbl.is/sport/frettir/2018/08/30/aaron_rodgers_launahaesti_leikmadur_i_sogu_nfl/';
  
  JSDOM.fromURL(url, {}).then(dom => {
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
    
    // res.send(article);
  });


});

module.exports = router;