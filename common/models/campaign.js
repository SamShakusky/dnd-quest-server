'use strict';

module.exports = function(Campaign) {
  var app = require('../../server/server');
  var es = require('event-stream');
  var PassThrough = require('stream').PassThrough;
  var filterNodes = require('loopback-filters');

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
            campaign.membersFull = adventurers;
            return campaign;
          });
        });

        Promise.all(results).then((completed) => {
          return cb(null, completed);
        }).catch((err) => {
          return err;
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

  Campaign.changes = function(campaignId, cb) {
    const options = {'where': {'campaignId': campaignId}};
    if (typeof options === 'function') {
      cb = options;
      options = undefined;
    }

    var idName = this.getIdName();
    var Model = app.models.Quest;
    var changes = new PassThrough({objectMode: true});

    changes._destroy = function() {
      changes.end();
      changes.emit('end');
      changes.emit('close');
    };

    changes.destroy = changes.destroy || changes._destroy; // node 8 compability

    changes.on('error', removeHandlers);
    changes.on('close', removeHandlers);
    changes.on('finish', removeHandlers);
    changes.on('end', removeHandlers);

    process.nextTick(function() {
      cb(null, changes);
    });

    Model.observe('after save', changeHandler);
    Model.observe('after delete', deleteHandler);

    return cb.promise;

    function changeHandler(ctx, next) {
      var change = createChangeObject(ctx, 'save');
      if (change) {
        changes.write(change);
      }

      next();
    }

    function deleteHandler(ctx, next) {
      var change = createChangeObject(ctx, 'delete');
      if (change) {
        changes.write(change);
      }

      next();
    }

    function createChangeObject(ctx, type) {
      var where = ctx.where;
      var data = ctx.instance || ctx.data;
      var whereId = where && where[idName];

      // the data includes the id
      // or the where includes the id
      var target;

      if (data && (data[idName] || data[idName] === 0)) {
        target = data[idName];
      } else if (where && (where[idName] || where[idName] === 0)) {
        target = where[idName];
      }

      var hasTarget = target === 0 || !!target;

      // apply filtering if options is set
      if (options) {
        var filtered = filterNodes([data], options);
        if (filtered.length !== 1) {
          return null;
        }
        data = filtered[0];
      }

      var change = {
        target: target,
        where: where,
        data: data,
        dispatcher: ctx.options.accessToken.userId,
      };

      switch (type) {
        case 'save':
          if (ctx.isNewInstance === undefined) {
            change.type = hasTarget ? 'update' : 'create';
          } else {
            change.type = ctx.isNewInstance ? 'create' : 'update';
          }

          break;
        case 'delete':
          change.type = 'remove';
          break;
      }

      return change;
    }

    function removeHandlers() {
      Model.removeObserver('after save', changeHandler);
      Model.removeObserver('after delete', deleteHandler);
    }
  };

  Campaign.remoteMethod(
    'changes',
    {
      http: {path: '/:id/changes', verb: 'get'},
      accepts: [
        {arg: 'id', type: 'string', description: 'campaignId'},
      ],
      description: 'Gets Campaign\'s changes',
      returns: {
        arg: 'changes',
        type: 'ReadableStream',
        json: true,
      },
    }
  );
};
