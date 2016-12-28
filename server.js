var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
require('./server/routes.js')(app, express);



app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
    extended: true
})); // for parsing application/x-www-form-urlencoded

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

var url = 'mongodb://127.0.0.1:27017/';
//take advantage of openshift env vars when available:
if (process.env.OPENSHIFT_MONGODB_DB_URL) {
    url = process.env.OPENSHIFT_MONGODB_DB_URL;
    mongoose.connect(url);
    var db = mongoose.connection;

    var schema = new mongoose.Schema({
        body: {},
        headers: {}
    });
    var webhook = mongoose.model('webhook', schema);
}



app.listen(server_port, server_ip_address, function() {
    console.log("Listening on " + server_ip_address + ", port " + server_port)
});
//mongodb://admin:ee1CkJGwc7Zh@127.11.121.130:27017/
