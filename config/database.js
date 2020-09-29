var mongoose = require ("mongoose");

var mongoDB = process.env.MONGOLAB_URI ||
"mongodb+srv://bearwolf:KillThemAll21!@ds243388-x5mk4.mongodb.net/tagit?retryWrites=true&w=majority";
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports.database = db;