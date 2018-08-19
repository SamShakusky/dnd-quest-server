'use strict';

module.exports = function(Campaign) {
  var app = require('../../server/server');

  Campaign.membership = function(adventurerId, cb) {
    Campaign.find({where: {members: {inq: adventurerId}}},
      function(err, campaigns) {
        if (err) return cb(null, err);

        var results = campaigns.map(campaign => {
          var membersId = campaign.members;
          return app.models.Adventurer.find({
            where: {id: {inq: membersId}},
            fields: {id: true, username: true},
          }).then(function(adventurers) {
            campaign.members = adventurers;
            return campaign;
          });
        });

        Promise.all(results).then((completed) => {
          return cb(null, completed);
        });
      }
    );
  };

  Campaign.remoteMethod(
    'membership',
    {
      http: {path: '/membership', verb: 'get'},
      accepts: {arg: 'adventurerId', type: 'string', http: {source: 'query'}},
      returns: {arg: 'items', type: 'object'},
    }
  );

  Campaign.addMember = function(campaignId, adventurerId, cb) {
    Campaign.findById(campaignId, function(err, instance) {
      if (err) return cb(null, err);

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
