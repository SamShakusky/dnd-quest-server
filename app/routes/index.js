const questRoutes = require('./quest_routes');
const authRoutes = require('./auth_routes');

module.exports = function(app, db) {
	questRoutes(app, db);
	authRoutes(app, db);
};