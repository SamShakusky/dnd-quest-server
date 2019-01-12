'use strict';

const send = require('../lib/mailer');
const emailAlphaStart = require('../emails/alpha-start');

const sendTokens = (adventurer, tempToken) => {
  const link = `https://adventurecompanion.app/password?access_token=${tempToken.id}`;
  
  const data = {
    to: adventurer.email,
    subject: 'Welcome to the Closed Alpha!',
    html: emailAlphaStart(adventurer.username, link),
  };
  
  send(data);
};

module.exports = function(Adventurer) {
  Adventurer.setTempTokens = function(cb) {
    Adventurer.find().then(adventurers => {
      const results = adventurers.map(adventurer => {
        const ttl = 3 * 24 * 60 * 60; // 259200 seconds == 3 days
        
        return adventurer.createAccessToken(ttl).then((tempToken) => {
          sendTokens(adventurer, tempToken);
          return `Temp token created for ${adventurer.email}.`;
        }).catch(err => {
          throw new Error(err);
        });
      });
      
      Promise.all(results).then((result) => {
        return cb(null, result);
      }).catch(err => {
        return cb(err);
      });
    });
  };
  
  Adventurer.remoteMethod(
    'setTempTokens',
    {
      http: {path: '/setTempTokens', verb: 'post'},
      description: 'Set temporary tokens to adventurers',
      returns: {arg: 'successful', type: 'array'},
    }
  );
};
