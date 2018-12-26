'use strict';

module.exports = function(Party) {
  var app = require('../../server/server');
  var Adventurer = app.models.Adventurer;
  const send = require('../lib/mailer');
  const randomList = require('../lib/random-list');
  const tempPass = require('../../config/keys/tempPass');
  
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
        
        // Arrays for the response
        const totalAdventurers = [];
        const totalErrors = [];
        
        // Iterate through tester parties
        const results = parties.map((party) => {
          if (!party || !party.emails) return false;
          const partyMembers = [];
          
          party.emails.map(email => {
            const mailUser = email.match(/^([^@]*)@/)[1];
            const username = mailUser + Math.random().toString().slice(-4);
            partyMembers.push({
              username,
              email,
              password: tempPass, // every tester is obliged to change this password
            });
          });
          
          // At the end we'll get new adventurers with a campaign
          return Adventurer.create(partyMembers)
            .then(adventurers => {
              // Adventurers were created successfuly, collect their ids
              const advIds = adventurers.map(adv => {
                totalAdventurers.push(adv); // also pass their data to response
                
                return adv.id.toString();
              });
              
              // Now we need a campaign for the adventurers
              // The first one would be it's owner
              return adventurers[0].campaigns.create({
                title: `${adventurers[0].username}'s Campaign`,
                members: advIds,
              }).then(campaign => {
                // Returning the new campaign to pass it in a response
                return campaign;
              }).catch(err => {
                return cb(err);
              });
            }).catch(error => {
              error.map((err, i) => {
                if (err != null) {
                  // Adventurer wasn't created for some reason
                  totalErrors.push(err.message);
                }
              });
              
              // nor was the campaign
              return null;
            });
        });
        
        Promise.all(results).then((campaigns) => {
          // passing campaigns' data to the response
          // including nulls, if there were some errors
          
          return cb(null, {
            adventurers: totalAdventurers,
            campaigns: campaigns.filter(el => el != null),
            errors: totalErrors,
          });
        }).catch(err => {
          return cb(err);
        });
      });
  };
  
  Party.remoteMethod(
    'createAdventures',
    {
      http: {path: '/createAdventures', verb: 'post'},
      description: 'Create Adventurers by Party testing status',
      returns: [
        {arg: 'data', type: 'object', root: true},
        {arg: 'adventurers', type: 'array'},
        {arg: 'campaigns', type: 'array'},
        {arg: 'errors', type: 'array'},
      ],
    }
  );
};

