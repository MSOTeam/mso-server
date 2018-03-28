const express = require('express');
const router  = express.Router();
var Shopper = require('../models/client');
   
router.post('/', (req, res, next) => {
  var client = new Client(req.body.client);
  client.save(
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
      res.send({ client });
    }
  );
});

router.get('/', (req, res, next) => {
  Client.find({}, 'looking_for styles budget hours occupation', function (err, shoppers) {
    if (err) {
      res.status(500).send(err)
    }
    res.send({ shopper });
  });
});

router.get('/:id', (req, res, next) => {
  Client.findOne({ _id: req.params.uid }, 'looking_for styles budget hours occupation', function (err, shoppers) {
    if (err) {
      res.status(500).send(err)
    }
    res.send({ shopper });
  });
});

module.exports = router;