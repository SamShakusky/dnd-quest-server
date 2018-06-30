const passport = require('passport');

module.exports = function(app, db) {
	app.get('/auth/logout', (req, res) => {
		res.send('logout');
	});
	
	app.get('/auth/google', passport.authenticate('google', {
		scope: ['profile'],
	}));
};
