'use strict';

module.exports = function(Adventurer) {
  Adventurer.on('resetPasswordRequest', function(data) {
    console.log(data);
  });
  
  Adventurer.setPassword = function(cb) {
    Adventurer.find().then(adventurers => {
      const results = adventurers.map(adventurer => {
        return Adventurer.resetPassword({
          email: adventurer.email,
        }).then(() => {
          return adventurer.email;
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
    'setPassword',
    {
      http: {path: '/setPassword', verb: 'post'},
      description: 'Set new password',
      returns: {arg: 'successful', type: 'array'},
    }
  );
};
