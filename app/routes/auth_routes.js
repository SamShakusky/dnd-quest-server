const passport = require('passport');

module.exports = function(app, db) {
	app.get('/auth/google', passport.authenticate('google', {
		scope: ['profile'],
	}),(req, res) => {
		// console.log(req, res);
	});
};
