const questRoutes = require('./quest_routes');

module.exports = function(app, db) {
  questRoutes(app, db);
};