const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet')
const passport = require('passport');

const auth = require('./routes/auth');
const shopper = require('./routes/shopper.js');
const client = require('./routes/client.js');

require('./config/database');
require('./passport');

const app = express();
const port = process.env.PORT || 5000;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());

app.use('/client', client);
app.use('/shopper', shopper);
app.use('/auth', auth);


app.listen(port, () => console.log(`Listening on port ${port}`));