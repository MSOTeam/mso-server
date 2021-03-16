const article = require('./article');
const auth = require('./auth');
const user = require('./user');
const tag = require('./tag');

module.exports = (app, passport) => {  
  app.use('/article', article);
  app.use('/auth', auth);
  app.use('/user', user);
  app.use('/tag', tag);
}