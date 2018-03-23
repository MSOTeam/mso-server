var mongoose = require ("mongoose");
  
var mongoDB = process.env.MONGOLAB_URI || 
"mongodb://mso:mso123ebu@ds029715.mlab.com:29715/heroku_z32776sz";;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports.database = db;