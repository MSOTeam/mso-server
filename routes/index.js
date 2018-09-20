const article = require('./article');
const auth = require('./auth');

module.exports = (app, passport) => {  
  app.use('/article', article);
  app.use('/auth', auth);
}