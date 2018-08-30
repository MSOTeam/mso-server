const article = require('./article');
const auth = require('./auth');

module.exports = (app, passport) => {
  // app.use('/client', client);
  // app.use('/shopper', shopper);
  app.use('/article', article);
  app.use('/auth', auth);
}