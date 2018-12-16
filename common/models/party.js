'use strict';

module.exports = function(Party) {
  var app = require('../../server/server');
  var Adventurer = app.models.Adventurer;
  const send = require('../lib/mailer');
  const randomList = require('../lib/random-list');

  Party.afterRemote('create', function sendEmails(ctx, modelInstance, next) {
    const emailList = modelInstance.emails;

    emailList.forEach(email => {
      const emailData = {
        to: email,
        subject: 'Successful registration',
        html: '<h3 style="color: red;">Well done!</h3>',
      };

      // send(emailData);
    });

    next();
  });

  Party.tester = function(partyId, flag, cb) {
    Party.findById(partyId, function(err, instance) {
      if (err || !instance) return cb(null, err);

      instance.updateAttributes({tester: flag}, function(err, changedInstance) {
        if (err || !changedInstance) return cb(null, err);

        cb(null, changedInstance);
      });
    });
  };

  Party.remoteMethod(
    'tester',
    {
      http: {path: '/:id/tester', verb: 'put'},
      accepts: [
        {arg: 'id', type: 'string', description: 'partyId'},
        {arg: 'flag', type: 'boolean'},
      ],
      description: 'Changes Party\'s testing status',
      returns: {arg: 'party', type: 'object'},
    }
  );

  Party.addTesters = function(amount, cb) {
    Party.find({}, function(err, parties) {
      const randomIndexes = randomList(+amount, parties.length - 1);
      parties.map((party, i) => {
        if (randomIndexes.indexOf(i) !== -1) {
          party.updateAttributes({tester: true},
            function(err, changedInstance) {
              if (err || !changedInstance) return cb(null, err);
            });
        }
      });
      cb(null, parties);
    });
  };

  Party.remoteMethod(
    'addTesters',
    {
      http: {path: '/addTesters', verb: 'put'},
      accepts: [
        {arg: 'amount', type: 'number'},
      ],
      description: 'Randomly add tester status to Parties',
      returns: {arg: 'parties', type: 'array'},
    }
  );

  Party.removeTesters = function(cb) {
    Party.find({where: {tester: true}},
      function(err, parties) {
        if (err || !parties) return cb(null, err);

        var results = parties.map(instance => {
          return instance.updateAttributes({tester: false},
            function(err, changedInstance) {
              if (err || !changedInstance) return cb(null, err);

              return changedInstance;
            });
        });

        Promise.all(results).then((completed) => {
          return completed;
        }).catch((err) => {
          return err;
        });

        cb(null, parties);
      });
  };

  Party.remoteMethod(
    'removeTesters',
    {
      http: {path: '/removeTesters', verb: 'put'},
      description: 'Changes all Parties\' testing status to false',
      returns: {arg: 'parties', type: 'array'},
    }
  );

  Party.createAdventures = function(cb) {
    Party.find({where: {tester: true}},
      function(err, parties) {
        if (err || !parties) return cb(null, err);

        Adventurer.create([
          {username: '1', email: '1@dawdd.com', password: '1234'},
          {username: '2', email: '2@2.aa', password: '1234'},
        ], function(err, adventurers) {
          let result = [];
          if (err) {
            adventurers.map((adv, i) => {
              if (err[i] != null) {
                adventurers[i].err = {
                  name: err[i].name,
                  messages: err[i].details.messages,
                };
              }
            });
          }

          return cb(null, adventurers);
        });
      });
  };

  Party.remoteMethod(
    'createAdventures',
    {
      http: {path: '/createAdventures', verb: 'post'},
      description: 'Create Adventurers by Party testing status',
      returns: {arg: 'adventurers', type: 'object'},
    }
  );
};

