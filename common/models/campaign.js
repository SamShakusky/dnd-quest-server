'use strict';

module.exports = function(Campaign) {
  Campaign.membership = function(adventurerId, cb) {
    Campaign.find({where: {members: {inq: adventurerId}}},
      function(err, instance) {
        var response = instance;
        cb(null, response);
      }
    );
  };

  Campaign.remoteMethod(
    'membership',
    {
      http: {path: '/membership', verb: 'get'},
      accepts: {arg: 'adventurerId', type: 'string', http: {source: 'query'}},
      returns: {arg: 'campaigns', type: 'object'},
    }
  );
};
