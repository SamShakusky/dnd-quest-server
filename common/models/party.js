'use strict';

module.exports = function(Party) {
  const send = require('../lib/mailer');

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

  Party.removeTesters = function(cb) {
    Party.find({where: {tester: true}},
      function(err, parties) {
        if (err || !parties) return cb(null, err);
        console.log(parties);

        var results = parties.map(instance => {
          return instance.updateAttributes({tester: false},
            function(err, changedInstance) {
              if (err || !changedInstance) return cb(null, err);

              return changedInstance;
            });
        });

        Promise.all(results).then((completed) => {
          return cb(null, completed);
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
};
