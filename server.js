var express = require('express');
var app = express();
var path = require('path');
var request = require('request');


// viewed at http://localhost:8080
app.use('/js', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/data', function(req, res) {
  request({
    headers: {
      'X-API-Key': 'd4N939vQCEpESX9Hl6XyVBPoQ4Mge3icKys5WanZ'
    },
    uri: 'https://api.propublica.org/congress/v1/bills/search.json?query=' + req.query.param,
    method: 'GET'
  }, function(error, response, body) {
    if (!error && response.statusCode == 200) {

      res.send(response.body);

    }
  })
});


app.listen(8080);
