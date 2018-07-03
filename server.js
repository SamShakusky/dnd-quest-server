const express     = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser  = require('body-parser');
const db          = require('./config/db');
const cors        = require('cors');
const app         = express();
const port        = 8000;
const passportSetup = require('./config/passport-setup');

const corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));
app.use(bodyParser.json());

MongoClient.connect(db.url, (err, client) => {
  if (err) return console.log(err);
  
  require('./app/routes')(app, client.db('dnd-quest-db'));
  
  app.listen(port, () => {
    console.log('We are live on ' + port);
  });
});