'use strict';

module.exports = function(Campaign) {
  Campaign.membership = function(adventurerId, cb) {
    console.log(adventurerId);
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

  Campaign.addMember = function(campaignId, adventurerId, cb) {
    Campaign.findById(campaignId, function(err, instance) {
      instance.updateAttributes({$push: {members: adventurerId}});
      cb(null, instance);
    });
  };

  Campaign.remoteMethod(
    'addMember',
    {
      http: {path: '/:id/addMember', verb: 'put'},
      accepts: [
        {arg: 'id', type: 'string', description: 'campaignId'},
        {arg: 'adventurerId', type: 'string'},
      ],
      description: 'Adds an Adventurer as a campaign member',
      returns: {arg: 'campaigns', type: 'object'},
    }
  );
};
