// const client = require('./client.js');  
// const shopper = require('./shopper.js');
const scraper = require('./scraper');
const auth = require('./auth');

module.exports = (app, passport) => {
  // app.use('/client', client);
  // app.use('/shopper', shopper);
  app.use('/scraper', scraper);
  app.use('/auth', auth);
}