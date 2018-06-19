const express = require('express');
const router  = express.Router();
const passport = require('passport');
var jwt = require('jsonwebtoken');
var Shopper = require('../models/shopper');
      
router.post('/', (req, res, next) => {  
  const shopper = new Shopper(req.body);
  shopper.save(
    function (err) {
      if (err) {        
        res.status(500).send(err);
      }
      res.send({ shopper });
    }
  );
});

router.put('/', (req, res, next) => {
  const token = req.headers.authorization;
  const shopper = jwt.verify(token, 'jwt_secret');

  Shopper.findByIdAndUpdate(shopper._id, { $set: { profile: req.body }}, { new: true }, function (err, shopper) {
    if (err) {        
      res.status(500).send(err);
    }
    res.send({ shopper });
  });  
});

// router.get('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
router.get('/', (req, res, next) => {
  Shopper.find({}, 'profile', function (err, shoppers) {
    if (err) {
      res.status(500).send(err)
    }
    console.log(shoppers);
    res.send({ shoppers });
  });
})

module.exports = router;