const express = require('express');
const jsdom = require("jsdom");
const passport = require('passport');

const router  = express.Router();

const Tag = require('../models/tag');

router.get('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {  
    Tag.find({user: req.user._id}, 'tag', (err, tags) => {    
        if (err) {
            res.status(500).send(err)
        }    
        res.send({ tags });    
    });
});

module.exports = router;