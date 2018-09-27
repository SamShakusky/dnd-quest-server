'use strict';

module.exports = function() {
  var app = require('../server');

  return function limit(req, res, next) {
    if (req.method !== 'POST') return next();

    var campaignId = req.params[0];

    app.models.Campaign.findById(campaignId, {
      include: {relation: 'quests'},
    }).then((resp) => {
      var campaign = resp.toJSON();
      var limit = campaign.limit;
      var questsLength = campaign.quests.length;

      if (questsLength >= limit) {
        var error = new Error(`You\'ve reached the Quest limit (${limit})`);
        error.statusCode = 507;
        return next(error);
      }
      next();
    });
  };
};
