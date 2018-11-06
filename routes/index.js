const article = require('./article');
const auth = require('./auth');
const user = require('./user');

module.exports = (app, passport) => {  
  app.use('/article', article);
  app.use('/auth', auth);
  app.use('/user', user);
}