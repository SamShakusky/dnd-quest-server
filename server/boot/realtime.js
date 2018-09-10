'use strict';

var es = require('event-stream');
module.exports = function(app) {
  var MyModel = app.models.Campaign;
  MyModel.createChangeStream(function(err, changes) {
      console.log(changes);
    changes.pipe(es.stringify()).pipe(process.stdout);
  });
}
