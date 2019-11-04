var mongoose = require ("mongoose");

var mongoDB = process.env.MONGOLAB_URI ||
"mongodb://bearwolf:KillThemAll21!@ds243388-a0.mlab.com:43388,ds243388-a1.mlab.com:43388/tagit?replicaSet=rs-ds243388";
//"mongodb://tagit:thunder1@ds247430.mlab.com:47430/tagit";
// "mongodb://mso:mso123ebu@ds029715.mlab.com:29715/heroku_z32776sz";
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports.database = db;