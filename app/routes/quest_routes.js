var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {
  app.post('/quests', (req, res) => {
    
    const quest = {
      title: req.body.title,
      description: req.body.description,
      goal: req.body.goal,
      reward: req.body.reward
    };
    
    if(quest.title) {
      db.collection('quests').insert(quest, (err, result) => {
        if (err) { 
          res.send({ 'Quest creation error': err }); 
        } else {
          res.send(result.ops[0]);
        }
      });
    } else {
      res.send({error: 'The title is required!'});
    }
  });
  
  app.get('/quests/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('quests').findOne(details, (err, item) => {
      if (err) {
        res.send({'Quest read error': err});
      } else {
        res.send(item);
      } 
    });
  });
  
  app.get('/quests', (req, res) => {
    db.collection('quests').find().toArray((err, data) => {
      if (err) {
        res.send({'Quests read error': err});
      } else {
        res.send(data);
      } 
    });
  });
  
  app.put ('/quests/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    
    const quest = {
      title: req.body.title,
      description: req.body.description,
      goal: req.body.goal,
      reward: req.body.reward
    };
    
    db.collection('quests').update(details, quest, (err, result) => {
      if (err) {
          res.send({'Quest update error': err});
      } else {
          res.send(quest);
      } 
    });
  });
  
  app.delete('/quests/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('quests').remove(details, (err, item) => {
      if (err) {
        res.send({'Quest removal error': err});
      } else {
        res.send({response : 'Quest ' + id + ' deleted!'});
      } 
    });
  });
};