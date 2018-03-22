
module.exports = function(app) {
      
  app.post('/api/shopper', (req, res) => {  
    console.log(req.body);
    res.send({ shopper: req.body });
  });
};