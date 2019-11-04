const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet')
const passport = require('passport');
const cors = require('cors');


require('./config/database');
require('./passport');

const app = express();
const port = process.env.PORT || 5000;

const whitelist = ['http://localhost:3000', 'https://tagit-api.herokuapp.com', 'https://tagit-client.herokuapp.com'];

var corsOption = {
  // origin: function (origin, callback) {
  //   if (whitelist.indexOf(origin) !== -1) {
  //     callback(null, true)
  //   } else {
  //     callback(new Error('Not allowed by CORS'))
  //   }
  // },
  // origin: 'https://tagit-api.herokuapp.com',
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token', 'Access-Control-Allow-Origin'],
  allowHeaders: ['Authorization', 'Content-Type', 'Origin', 'X-Requested-With', 'Accept'],
};
app.use(cors(corsOption));

app.options('*', cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(helmet());
// app.use(helmet.permittedCrossDomainPolicies())

require('./routes')(app, passport);

const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.set('socketio', io);


io.on("connection", socket => {
  // console.log("New client connected");
  socket.on("disconnect", () => {
    // console.log("Client disconnected");
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));

// app.listen(port, () => console.log(`Listening on port ${port}`));