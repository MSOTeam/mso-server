const express = require('express');
const jsdom = require("jsdom");
const passport = require('passport');
// const cleanup = require('jsdom-global')()
const readability = require('../utils/readability/index');
var read = require('read-art');
const extractor = require('unfluff');

// const Parser = require('../utils/parser/safari');

const { JSDOM } = jsdom;
const Readability = readability.Readability;
const JSDOMParser = readability.JSDOMParser;

const router  = express.Router();
const { extract } = require('article-parser');

const Article = require('../models/article');
const Tag = require('../models/tag');



// router.post('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
//   JSDOM.fromURL(req.body.url, {}).then(dom => {
//     const document = dom.window.document;
//     var scrapedArticle = new Readability(document).parse();

//     const article = new Article(scrapedArticle);
//     article.user = req.user._id;
//     article.tags = JSON.parse(req.body.tags);
//     article.url = req.body.url;

//     article.save(
//       function (err) {
//         if (err) {
//           res.status(500).send(err);
//         }
//         res.send({ article });
//       }
//     );
//   });
// });


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

    JSDOM.fromURL(req.body.url, {}).then(dom => {
      const document = dom.window.document;
      const readabilityArticle = new Readability(document).parse();

      // console.log(Parser(document));

      extract(url).then((article) => {
        const art = new Article();
        art.user = req.user._id;
        art.title = readabilityArticle.title;
        art.content = readabilityArticle.content;
        art.original = readabilityArticle.content;
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
            // console.log(art);
          }
        );
      });
    });
  });

  return;
});


router.put('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {

  const { article, id } = req.body;

  Article.findByIdAndUpdate(
    {
      _id: id
    },
    {
      $set: {
        content: article.content,
        tags: article.tags,
      }
    },
    (err, article) => {
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