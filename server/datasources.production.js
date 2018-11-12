'use strict';

var dbConf = require('../config/db');

module.exports = {
  db: {
    host: dbConf.prod.host,
    port: dbConf.prod.port,
    database: dbConf.prod.database,
    user: dbConf.prod.user,
    password: dbConf.prod.password,
    connector: 'mongodb',
    useNewUrlParser: 'true',
  },
};
