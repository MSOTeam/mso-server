const express = require('express');
const router  = express.Router();
const passport = require('passport');
var Shopper = require('../models/shopper');
      
router.post('/', (req, res, next) => {
  var shopper = new Shopper(req.body);
  shopper.save(
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
      res.send({ shopper });
    }
  );
});

router.get('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  Shopper.find({}, 'price about instagram styles assists_with calendar', function (err, shoppers) {
    if (err) {
      res.status(500).send(err)
    }
    res.send({ shopper });
  });
})

module.exports = router;