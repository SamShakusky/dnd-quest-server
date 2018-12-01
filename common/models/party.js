'use strict';

module.exports = function(Party) {
  const send = require('../lib/mailer');

  Party.observe('before save', function sendEmails(ctx, next) {
    const emailList = ctx.instance.emails;

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
};
