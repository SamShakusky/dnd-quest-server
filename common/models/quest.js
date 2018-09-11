'use strict';

var PassThrough = require('stream').PassThrough;

module.exports = function(Quest) {
  var es = require('event-stream');

  Quest.changes = function(campaignId, cb) {
    Quest.createChangeStream(function(err, changes) {
      cb(null, changes);
    });
  };

  Quest.remoteMethod(
    'changes',
    {
      http: {path: '/:id/changes', verb: 'get'},
      accepts: [
      {arg: 'id', type: 'string', description: 'campaignId'},
      ],
      description: 'Gets Quest\'s changes',
      returns: {
        arg: 'changes',
        type: 'ReadableStream',
        json: true,
      },
    }
  );
};
