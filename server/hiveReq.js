var crypto = require('crypto');
var request = require('request');


var hiveReq = function(query) {
    var timeStamp = new Date();
    var url = 'https://openapi.wix.com';
    var reqQuery = '';
    var signString = '';
    var paramArray = [{
        'version': '1.0.0'
    }];
    var signArray = [];
    var formData = {};
    var options = {};
    var queryParams = null;
    var parsedBody;
    var signature;
    var res = {};
    var parseBody = function() {
        if (query.postBody) {
            parsedBody = JSON.parse(query.postBody);
            parsedBody.forEach(function(elem) {
                formData[elem.key] = elem.value;
                var obj = {};
                obj[elem.key] = elem.value;
                paramArray.push(obj);
            })
        }
    }
    var parseQuery = function() {
        if (query.queryParams) {
            queryParams = JSON.parse(query.queryParams);
            queryParams.forEach(function(elem) {
                reqQuery += '&' + elem.key + '=' + elem.value;
                var obj = {};
                obj[elem.key] = elem.value;
                paramArray.push(obj);
            })
        }
    }
    var fillOptions = function() {
        options = {
            method: query.requestType,
            url: url + query.relativeUrl + '?version=1.0.0' + reqQuery,
            headers: {
                'x-wix-application-id': query.appId,
                'x-wix-instance-id': query.instanceId,
                'x-wix-timestamp': timeStamp,
                'x-wix-signature': signature //signature that my server generated (equal sign is tossed)
            },
        }
        Object.keys(formData).length > 0 ? options.form = formData : null;
    }
    var sign = function() {
        var res;
        timeStamp = timeStamp.toISOString();
        signArray.unshift(query.relativeUrl);
        signArray.unshift(query.requestType);
        paramArray.forEach(function (item) {
          Object.keys(item).map(function(key) {
            signArray.push(item[key]);
          })
        })
        signArray.push(timeStamp);
        signString = signArray.join('\n');
        res = crypto.createHmac('sha256', query.secretKey);
        signature = res.update(signString).digest('base64').replace(/\+/g, '-').replace(/\//g, '_'); //different base64 standards
    }
    var parseParams = function() {
        parseBody();
        parseQuery();
        paramArray.push({
          'x-wix-application-id': query.appId
        });
        paramArray.push({
          'x-wix-instance-id': query.instanceId
        });
        paramArray.sort(function(a,b) {
          return (Object.keys(a)[0] > Object.keys(b)[0] ?  1 : -1)
        });

    }
    this.run = function(res) {
        parseParams();
        sign();
        fillOptions();
        request(options, function(error, response, body) {
            res.send(response.body);
        });
    }
}
module.exports = hiveReq;
