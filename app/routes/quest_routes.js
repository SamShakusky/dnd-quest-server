module.exports = function(app, db) {
  app.post('/quests', (req, res) => {
    const quest = { text: req.body.body, title: req.body.title };
    db.collection('quests').insert(quest, (err, result) => {
      if (err) { 
        res.send({ 'error': 'An error has occurred' }); 
      } else {
        res.send(result.ops[0]);
      }
    });
  });
};