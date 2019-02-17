var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('index', {
		title: "Express",
		logged: false
	});
});

router.get('/signup', function(req, res, next) {
	res.render('signup');
});

router.post('/signup', function(req, res, next) {
	req.checkBody('email', 'Invalid email')
		.matches(/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, "i");
	req.checkBody('password', 'Password must be a combination of an upper and a lower case letter, a number, and a special character')
		.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!\?&@#%\$\+\-\*/])(?=.{8,})/, "i");
	req.checkBody('username', 'Username must not contain any spaces')
		.matches(/^[a-zA-Z0-9]{8,}/, "i");

	var errs = req.validationErrors();
	if(errs) {
		res.render('signup', {
			username: req.body.username,
			email: req.body.email,
			password: req.body.password,
			errors: errs
		});
	} else {
		var userData = {
			email: req.body.email,
			username: req.body.username,
			password: req.body.password
		};
		
		User.create(userData, function(err, user) {
			if(err) {
				return next(err);
			} else {
				req.session.userId = user._id;
				return res.redirect('/');
			}
		});
	}
});

router.get('/course', function(req, res, next) {
	res.render('course_interface');
});

module.exports = router;
