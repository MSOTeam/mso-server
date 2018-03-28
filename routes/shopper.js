const express = require('express');
const router  = express.Router();
var Shopper = require('../models/shopper');
      
router.post('/', (req, res, next) => {
  var shopper = new Shopper(req.body.shopper);
  shopper.save(
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
      res.send({ shopper });
    }
  );
});

router.get('/', (req, res, next) => {
  Shopper.find({}, 'price about instagram styles assists_with calendar', function (err, shoppers) {
    if (err) {
      res.status(500).send(err)
    }
    res.send({ shopper });
  });
})

module.exports = router;