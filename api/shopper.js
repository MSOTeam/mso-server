var Shopper = require('./models/shopper');

module.exports = function(app) {
      
  app.post('/api/shopper', (req, res) => {     
    var shopper = new Shopper (req.body.shopper);    
    shopper.save(
      function (err) {
        if (err) {
           res.status(500).send(err);
        }
        res.send({ shopper });
      }
    );    
  });

  app.get('/api/shopper', (req, res) => {
    Shopper.find({}, 'price about instagram styles assists_with calendar', function (err, shoppers) {
      if (err) { 
        res.status(500).send(err)
      }
      res.send({ shopper });
    });
  })

};