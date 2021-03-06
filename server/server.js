'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

var http = require('http');
var https = require('https');
var sslConfig = require('../config/ssl-config');

var app = module.exports = loopback();

var limit = require('./middleware/limit');

app.middleware('routes:before', '/api/Campaigns/*/quests', limit('dev'));

// boot scripts mount components like REST API
boot(app, __dirname);

app.start = function(httpOnly) {
  if (httpOnly === undefined) {
    httpOnly = process.env.HTTP;
  }
  var server = null;
  if (!httpOnly) {
    var options = {
      key: sslConfig.privateKey,
      cert: sslConfig.certificate,
    };
    server = https.createServer(options, app);
  } else {
    server = http.createServer(app);
  }

  server.listen(app.get('port'), function() {
    var baseUrl = (httpOnly ? 'http://' : 'https://') + app.get('host') + ':' + app.get('port');
    app.emit('started', baseUrl);
    console.log('LoopBack server listening @ %s%s', baseUrl, '/');
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
  return server;
};

app.use(loopback.token({
  model: app.models.accessToken,
  currentUserLiteral: 'me',
}));

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});

function randomList(amount, max) {
  const result = [];
  let num = 0;
  while (result.length < amount) {
    const randomNum = Math.round(Math.random() * (max - 0));
    if (result.indexOf(randomNum) === -1) result.push(randomNum);
    num++;
  }
  console.log(num, result);
};
