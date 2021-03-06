'use strict';

var dbConf = require('../config/keys/db');
var mailConf = require('../config/keys/mail');

module.exports = {
  db: {
    host: dbConf.prod.host,
    port: dbConf.prod.port,
    database: dbConf.prod.database,
    user: dbConf.prod.user,
    password: dbConf.prod.password,
    authSource: dbConf.prod.authSource,
    connector: 'mongodb',
    useNewUrlParser: 'true',
  },
  mailgun: {
    connector: 'loopback-connector-mailgun',
    apikey: mailConf.apiKey,
    domain: mailConf.domain,
  },
};
