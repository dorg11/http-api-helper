var crypto = require('crypto');
var request = require('request');

var hiveReq = function(body) {
    var timeStamp = new Date();
    var result = {};
    timeStamp = timeStamp.toISOString();
    var url = 'https://openapi.wix.com';
    var reqQuery = '';
    var signString = '';
    var signArray = [];
    var formData = {};
    var options = {};
    var queryParams = null;
    var parsedBody;
    var signature;
    var res = {};
    body.relativeUrl = "/v1"  + body.relativeUrl;
    var createSignStr = function() {
      Object.keys(body.queryParams).sort().forEach(key => {
        signArray.push(body.queryParams[key])
      });
      signArray.push(body.appId);
      signArray.push(body.instanceId);
      signArray.push(timeStamp);
      if(body.rawBody) signArray.push(JSON.stringify(body.rawBody));
      signArray.unshift(body.relativeUrl);
      signArray.unshift(body.requestType);
      signString = signArray.join('\n');
    }
    var fillOptions = function() {
        options = {
            method: body.requestType,
            url: url + body.relativeUrl +  body.queryString,
            headers: {
                'x-wix-application-id': body.appId,
                'x-wix-instance-id': body.instanceId,
                'x-wix-timestamp': timeStamp,
                'x-wix-signature': signature //signature that my server generated (equal sign is tossed)
            }
        }
        if (body.rawBody) {
          options.json = true;
          options.body = body.rawBody;
        }
        Object.keys(formData).length > 0 ? options.form = formData : null;
    }

    var sign = function() {
        res = crypto.createHmac('sha256', body.secretKey);
        signature = res.update(signString).digest('base64').replace(/\+/g, '-').replace(/\//g, '_'); //different base64 standards
    }
    this.run = function(responseObject) {
      createSignStr();
      sign();
      fillOptions();
      result.signString = signString;
      result.options = options;
      request(options, function(error, hiveResponse, body) {
            try {
              result.response = JSON.parse(hiveResponse.body)
            } catch (err) {
              result.response = JSON.parse(JSON.stringify(hiveResponse.body));
            };
            responseObject.send(result);
        });
    }
}
module.exports = hiveReq;
