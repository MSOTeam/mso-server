const express = require('express');
const jsdom = require("jsdom");
const readability = require('../utils/readability/index');

const router  = express.Router();
const { JSDOM } = jsdom;
const Readability = readability.Readability;
const JSDOMParser = readability.JSDOMParser;

router.get('/', (req, res, next) => {
  
  JSDOM.fromURL("https://example.com/", {}).then(dom => {
    const document = dom.window.document;
    var article = new Readability(document).parse();
    console.log(article);
    res.send(null);
  });

});

module.exports = router;