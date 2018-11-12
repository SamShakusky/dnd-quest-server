'use strict';

var dbConf = require('../config/db');

module.exports = {
  db: {
    url: dbConf.dev.url,
    database: 'dnd-quest-db',
    name: 'db',
    connector: 'mongodb',
    useNewUrlParser: 'true',
  },
};
