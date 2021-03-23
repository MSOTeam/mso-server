const express = require('express');
const passport = require('passport')
const router  = express.Router();

const Article = require('../models/article');
const Tag = require('../models/tag');

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    Tag.find({user: req.user._id}, 'tag', (err, tags) => {
        if (err) {
            res.status(500).send(err)
        }
        res.send({ tags });
    });
});

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const tags = [];
    JSON.parse(req.body.tags).forEach(tag => {
      tags.push({ user: req.user._id, tag });
    });

    Tag.create(tags, (err) => {
      if (err) {
        res.status(500).send(err);
      }
    });
});

router.put('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  const { tag, newTag } = req.body;
  const user = req.user.id;

  // Tag.findOneAndUpdate({ user, tag }, { tag: newTag })
  // .then(() => {      
  //   // Article.updateMany({ user, tag }, {"$set":{"tag": newTag}})
  //   // .then((updated) =>  {
  //   //   console.log(updated);
  //   //   res.send({ updated })
  //   // });
  // })
  // .catch((error) => {
  //   console.log(error);
  //   res.status(500).json(error)
  // });

  // console.log({ user, tag, newTag });

  var promises = [];

  Tag.findOneAndUpdate({ tag }, { tag: newTag })
  .then(() => {
    Article.find({ user, tags: tag }, (err, articles) => {
      articles.map(article => {
        const { _id, tags } = article;      

        tags[tags.indexOf(tag)] = newTag;
        var promise = new Promise((resolve, reject) => {
          Article.findByIdAndUpdate({ _id }, { $set: { tags }}).then((condition, update, options) => {
            resolve(update);
          })
        });

        promises.push(promise);
      });
    })
    .then(() => {      
      Promise.all(promises).then(values => {
        var io = req.app.get('socketio');;
        io.emit('article', { socket:  "updated article" });

        res.send({ updated: true })
      });
    });
  })
  .catch((error) => {
    res.status(500).json(error)
  });
  
});

router.delete('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {

});

module.exports = router;