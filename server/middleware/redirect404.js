'use strict';

const path = require('path');
module.exports = function() {
    console.log('fired!');
  return function redirect404(req, res, next) {
    var newPath = path.normalize(__dirname + '/../../client/index.html');
    res.sendFile(newPath);
  };
};
