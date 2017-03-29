var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var hiveReq = require('./server/hiveReq');

app.use(bodyParser.json()); // for parsing application/json

app.use('/', express.static('.'));

app.post('/hivePost', function(req, res) {
  var requestObj = new hiveReq(req.body);
  requestObj.run(res);
})

var port = process.env.PORT;

app.listen(port);
