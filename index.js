const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet')
const passport = require('passport');
const cors = require('cors');


require('./config/database');
require('./passport');

const app = express();
const port = process.env.PORT || 5000;

const whitelist = ['http://localhost:3000'];

var corsOption = {
  // origin: (origin, callback) => {
  //   if (whitelist.includes(origin)) {
  //     return callback(null, true);
  //   }
  //   callback(new Error('Not allowed by CORS'));
  // },
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: false,
  exposedHeaders: ['x-auth-token'],
  allowHeaders: ['Authorization', 'Content-Type', 'Origin', 'X-Requested-With', 'Accept'],
};
app.use(cors(corsOption));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());

require('./routes')(app, passport);

const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.set('socketio', io);


io.on("connection", socket => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));

// app.listen(port, () => console.log(`Listening on port ${port}`));