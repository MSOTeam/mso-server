const client = require('./client.js');  
const shopper = require('./shopper.js');
const auth = require('./auth');

module.exports = (app, passport) => {
  app.use('/client', client);
  app.use('/shopper', shopper);
  app.use('/auth', auth);
}