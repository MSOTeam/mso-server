const express = require('express');
const passport = require('passport')
const router  = express.Router();

const Article = require('../models/article');
const Tag = require('../models/tag');

// const createDOMPurify = require('dompurify');
// const { JSDOM } = require('jsdom');
// const window = new JSDOM('').window;
// const DOMPurify = createDOMPurify(window);

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
      // let tag = dirty.toLocaleLowerCase();
      tags.push({ user: req.user._id, tag });
    });

    Tag.create(tags, (err) => {
      if (err) {
        res.status(500).send(err);
      }
    });
});

const updateArticles = (query, newTag, req, res) => {
  var promises = [];

  Article.find(query, (err, articles) => {
    articles.map(article => {
      const { _id } = article;
      let { tags } = article;
      
      if(newTag === 'archive') {
        if(tags.length === 1) {
          tags = ['archive'];
        } else {
          tags.splice(tags.indexOf(query.tags), 1);
        }
      } else {
        tags[tags.indexOf(query.tags)] = newTag;
      }
            
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
      io.emit('menu', { socket:  "menu" });

      res.send({ updated: true })
    });
  })
}

router.put('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  let { tag, newTag } = req.body;
  const user = req.user.id;
  const query = { user, tags: tag };

  if(!newTag) {

    Tag.findOneAndDelete({ user, tag })
    .then(() => {      
      updateArticles(query, 'archive', req, res);
    })
    .catch((error) => {
      res.status(500).json(error)
    });

  }
  else {

    // newTag = newTag.toLocaleLowerCase();

    Tag.findOne({ user, tag: newTag }, 'tag', (err, currentTag) => {
      if (err) {
        res.status(500).send(err)
      }

      if(currentTag) {        
        Tag.findOneAndDelete({ user, tag })
        .then(() => {
          updateArticles(query, newTag, req, res);
        })
        .catch((error) => {
          res.status(500).json(error)
        });
      } else {
        Tag.findOneAndUpdate({ user, tag }, { tag: newTag })
        .then(() => {
          updateArticles(query, newTag, req, res);
        });    
      }

    })
    .catch((error) => {
      res.status(500).json(error)
    });


    // Tag.findOneAndUpdate({ user, tag }, { tag: newTag })
    // .then(() => {
    //   Article.find({ user, tags: tag }, (err, articles) => {
    //     articles.map(article => {
    //       const { _id, tags } = article;      

    //       tags[tags.indexOf(tag)] = newTag;
    //       var promise = new Promise((resolve, reject) => {
    //         Article.findByIdAndUpdate({ _id }, { $set: { tags }}).then((condition, update, options) => {
    //           resolve(update);
    //         })
    //       });

    //       promises.push(promise);
    //     });
    //   })
    //   .then(() => {      
    //     Promise.all(promises).then(values => {
    //       var io = req.app.get('socketio');;
    //       io.emit('article', { socket:  "updated article" });

    //       res.send({ updated: true })
    //     });
    //   });
    // })
    // .catch((error) => {
    //   res.status(500).json(error)
    // });
  }
  
});

router.delete('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {

});

module.exports = router;