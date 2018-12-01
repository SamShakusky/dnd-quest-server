'use strict';

var dbConf = require('../config/keys/db');
var mailConf = require('../config/keys/mail');

module.exports = {
  db: {
    url: dbConf.dev.url,
    database: 'dnd-quest-db',
    name: 'db',
    connector: 'mongodb',
    useNewUrlParser: 'true',
  },
  mailgun: {
    connector: 'loopback-connector-mailgun',
    apikey: mailConf.apiKey,
    domain: mailConf.domain,
  },
};
