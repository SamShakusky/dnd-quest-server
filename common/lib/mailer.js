'use strict';

module.exports = function send(data) {
  if (! data) return false;

  const loopback = require('loopback');
  const emailData = {
    to: data.to || '',
    from: data.from || 'dm@adventurecompanion.app',
    subject: data.subject || '',
    html: data.html || '',
  };

  loopback.Email.send(emailData)
  .then(function(response) {
    console.log(response);
  })
  .catch(function(err) {
    console.error(err);
  });
};
