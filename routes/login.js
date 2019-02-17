var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/', function(req, res, next) {
	res.render('login');
});


router.post('/conn', function(req, res, next) {
	req.checkBody('email', 'Invalid email')
		.matches(/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, "i");
	req.checkBody('password', 'Password must be a combination of an upper and a lower case letter, a number, and a special character')
		.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!\?&@#%\$\+\-\*/])(?=.{8,})/, "i");

	var errs = req.validationErrors();
	if(errs) {
		res.render('login', {
			email: req.body.email,
			password: req.body.password,
			errors: errs
		});
	} else {
		User.authenticate(req.body.email, req.body.password, function(err, user) {
			if(err || !user) {
				var err = new Error('Wrong email or password');
				err.status = 401;
				return next(err);
			} else {
				req.session.userId = user._id;
				return res.redirect('/');
			}
		});
	}
});


module.exports = router;
