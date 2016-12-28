var path = require('path');
var hiveReq = require('./hiveReq.js');
var request = require('request');
var crypto = require('crypto');

module.exports = function(app, express){

  app.use('/', express.static('.'));

  app.get('/hive', function(req, res) {
      res.sendFile(path.join(__dirname, '..' ,'hive.html'));
  });
  app.get('/test', function(req, res) {
    res.send({"a" : "b"});
  })
  app.get('/hiveGet', function(req, res) {
      var request = new hiveReq(req.query);
      request.run(res);
  });
  app.post('/server', function(req, res) {
      var data = new webhook({
          body: req.body,
          headers: req.headers
      });
      data.save(function(err) {
          if (err) {
              res.send(err);
          } else {
              res.send('saved!');
          }
      })
  });
  app.get('/', function(req, res) {
      res.sendFile(path.join(__dirname, '..' , 'index.html'));
  });

  app.get('/change', function(req, res) {
      res.redirect('/instance');
  });

  app.get('/instance', function(req, res) {
      res.sendFile(path.join(__dirname, '..' , 'instance.html'));
  });
  app.get('/sign', function(req, res) {
      var data = req.query.data;
      console.log(data);
      var hmac = crypto.createHmac('sha256', req.query.signature);
      res.send(hmac.update(data).digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, ''));
  });
  app.get('/get', function(req, res) {
      webhook.find({}, function(err, data) {
          res.json(data);
      })
  });

}
