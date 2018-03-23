var Shopper = require('./models/shopper');

module.exports = function(app) {
      
  app.post('/api/shopper', (req, res) => {  
    console.log(req.body);

    var shopper = new Shopper ({
      first_name: 'John',
      last_name: 'Doe',
    });

    shopper.save(
      function (err) {
        if (err) {
           console.log ('Error on save!');
        }
        console.log('New Shopper: ' + shopper);
      }
    );

    res.send({ shopper: req.body });
  });
};