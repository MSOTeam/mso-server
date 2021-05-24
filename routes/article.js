const express = require('express');
const jsdom = require("jsdom");
const passport = require('passport');
// const readability = require('../utils/readability/index');
// const readability = require('./../utils/readability/index.js');
var read = require('read-art');

const request = require('request');
const cheerio = require('cheerio');


const { JSDOM } = jsdom;
// const Readability = readability.Readability;
// const JSDOMParser = readability.JSDOMParser;

const router  = express.Router();
const { extract } = require('article-parser');

const Article = require('../models/article');
const Tag = require('../models/tag');


router.post('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {

  // read(req.body.url, (err, art, options, resp) => {
  //   if(err) {
  //     res.status(500).send(err);
  //   }
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

    request(req.body.url, function (error, response, responseHtml) {
      //if there was an error
      if (error) {
        res.status(500).send(error);
        return;
      }

      const art = new Article();

      art.user = req.user._id;
      art.tags = JSON.parse(req.body.tags);
      art.url = url;

      try {
        $ = cheerio.load(responseHtml);
        art.title = $('meta[property="og:title"]').attr('content');
        art.image = $('meta[property="og:image"]').attr('content');
      } 
      catch(e) {      
      }

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


router.delete('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  const user = req.user.id;
  const query = { user, tags: 'archive' };

  Article.updateMany(
    query,
    { $set: { user : 'deleted' } },
    (err) => {
      console.log(err);
    }
  );

  res.status(200).send('deleted');
});

router.get('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  let query = { user: req.user.id };
  let {tag, text} = req.query;
  if (tag) {
    query.tags = tag;
  }
  
  if (!text) {    
    text = '';
  }

  //Article.find(query, 'image title url content length excerpt tags createdAt', (err, articles) => {
    Article.find(query, 'image title url tags createdAt', (err, articles) => {
    if (err) {
      // res.status(500).send(err)
      console.log(err);
    }
    res.send({ articles });
  })
  .or([{ 'title': { $regex: text, $options: 'i' }}, { 'tags': { $elemMatch: { $regex: text, $options: 'i' }}}])
  .sort( { createdAt: -1 } );
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