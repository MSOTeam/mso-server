const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet')
const passport = require('passport');
const cors = require('cors');

require('./config/database');
require('./passport');

const app = express();
const port = process.env.PORT || 5000;

var corsOption = {
  origin: "*",
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token'],
  allowHeaders: ['Authorization', 'Content-Type', 'Origin', 'X-Requested-With', 'Accept'],
};
app.use(cors(corsOption));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());

require('./routes')(app, passport);

app.listen(port, () => console.log(`Listening on port ${port}`));