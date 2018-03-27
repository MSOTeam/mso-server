var Shopper = require('../models/client');

module.exports = function(app) {
      
  app.post('/api/client', (req, res) => {     
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

  app.get('/api/client', (req, res) => {
    Client.find({}, 'looking_for styles budget hours occupation', function (err, shoppers) {
      if (err) { 
        res.status(500).send(err)
      }
      res.send({ shopper });
    });
  });

  app.get('/api/client/:id', (req, res) => {
    Client.findOne({_id: req.params.uid}, 'looking_for styles budget hours occupation', function (err, shoppers) {
      if (err) { 
        res.status(500).send(err)
      }
      res.send({ shopper });
    });
  });

};