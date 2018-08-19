'use strict';

module.exports = function(app) {
  var Role = app.models.Role;

  Role.registerResolver('teamMember', function(role, context, cb) {
    // Q: Is the current request accessing a Project?
    if (context.modelName !== 'Campaign') {
      // A: No. This role is only for projects: callback with FALSE
      return process.nextTick(() => cb(null, false));
    }

    // Q: Is the user logged in? (there will be an accessToken with an ID if so)
    var userId = context.accessToken.userId;
    if (!userId) {
      // A: No, user is NOT logged in: callback with FALSE
      return process.nextTick(() => cb(null, false));
    }

    // Q: Is the current logged-in user associated with this Project?
    // Step 1: lookup the requested project
    context.model.findById(context.modelId, function(err, campaign) {
      // A: The datastore produced an error! Pass error to callback
      if (err) return cb(err);
      // A: There's no project by this ID! Pass error to callback
      if (!campaign) return cb(new Error('Campaign not found'));

      // A: If Project includes userId, then give access
      var jsCampaign = JSON.parse(JSON.stringify(campaign));
      var jsId = JSON.parse(JSON.stringify(userId));

      if (jsCampaign.members.includes(jsId)) {
        return cb(null, true);
      } else {
        return cb(new Error('Authorization Required'));
      }
    });
  });

  Role.registerResolver('self', function(role, context, cb) {
    var user = context.accessToken.userId;
    var reqUser = context.remotingContext.args.adventurerId;

    if (user == reqUser) {
      return cb(null, true);
    } else {
      return cb(new Error('Authorization Required'));
    }
  });
};
