var mongoose = require ("mongoose");

var uristring = process.env.MONGOLAB_URI || "";

var db = mongoose.connect(uristring, function (err, res) {
  if (err) {
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  }
});

modules.export.database = db;