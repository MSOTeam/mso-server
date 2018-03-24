var Shopper = require('./models/shopper');

module.exports = function(app) {
      
  app.post('/api/shopper', (req, res) => {     

    var shopper = new Shopper (req.body.shopper);    
    shopper.save(
      function (err) {
        if (err) {          
           console.log ('Error on save', err);
           res.status(500).send(err)
        }
        console.log('New Shopper: ' + shopper);
        res.send({ shopper });
      }
    );    
  });
};