const express = require('express');
const passport = require('passport');

const router  = express.Router();

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

});

router.delete('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {

});

module.exports = router;