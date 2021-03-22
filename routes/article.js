const express = require('express');
const jsdom = require("jsdom");
const passport = require('passport');
// const readability = require('../utils/readability/index');
const readability = require('./utils/readability/index');
var read = require('read-art');


const { JSDOM } = jsdom;
const Readability = readability.Readability;
const JSDOMParser = readability.JSDOMParser;

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
        // ignore unique constraint error
        if(err.code !== 11000) {
          res.status(500).send(err);
        }
        console.log(err);
        // res.status(500).send(err);
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
        // art.content = readabilityArticle.content;
        // art.original = readabilityArticle.content;
        art.tags = JSON.parse(req.body.tags);
        art.url = url;
        art.image = article.image;
        art.length = article.duration;

        // art.on('index', function (err) {
        //   if (err) console.error(err);
        // })

        art.save(
          (err) => {
            if (err) {
              if(err.code === 11000) {
                // custom error message for unique article, ignore now to avoid crash
                console.log(err.code);
              } else {
                res.status(500).send(err);
              }
            }
            var io = req.app.get('socketio');;
            io.emit('article', { socket:  "new article" });
            res.send({ art });
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
  let query = { user: req.user.id };
  const {tag, text} = req.query;
  if (req.query.tag) {
    query.tags = req.query.tag;
  }

  if (req.query.text) {
     query.$text = { $search: req.query.text };
  }

  Article.find(query, 'image title url content length excerpt tags createdAt', (err, articles) => {
    if (err) {
      // res.status(500).send(err)
      console.log(err);
    }
    res.send({ articles });
  }).sort( { createdAt: -1 } );
});

router.get('/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  Article.findOne({ _id: req.params.id, user: req.user.id }, 'title content length tags image url', (err, article) => {
    if (err) {
      res.status(500).send(err)
    }
    res.send({ article });
  });
});

module.exports = router;