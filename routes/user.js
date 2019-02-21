var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/login', function(req, res, next) {
	res.render('login', {errors: []});
});


router.post('/login', function(req, res, next) {
	req.checkBody('email', 'Invalid email format')
		.matches(/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, "i");
	req.checkBody('password', 'Password must be a combination of an upper and a lower case letter, a number, and a special character')
		.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!\?&@#%\$\+\-\*/])(?=.{8,})/, "i");

	var errs = req.validationErrors() || [{param: 'NOT'}];
	console.log('IN');
	if(errs) {
		res.render('login', {
			email: req.body.email,
			password: req.body.password,
			errors: errs
		});
	} else {
		User.authenticate(req.body.email, req.body.password, function(err, user) {
			if(err || !user) {
				res.render('login', {
					email: req.body.email,
					password: req.body.password,
					errors: [{msg: "Wrong email or password"}]
				});
			} else {
				req.session.userId = user._id;
				return res.redirect('/');
			}
		});
	}
});

router.get('/signup', function(req, res, next) {
	res.render('signup', {errors: []});
});


router.post('/signup', function(req, res, next) {
	req.checkBody('email', 'Invalid email')
		.isEmail().normalizeEmail();
	req.checkBody('username', 'Please enter a username')
		.isLength({min: 5});
	req.checkBody('password', 'contain at least one upper case')
		.matches(/^(?=.*[A-Z])/);
	req.checkBody('password', 'contain at least one lower case')
		.matches(/^(?=.*[a-z])/);
	req.checkBody('password', 'contain at least one digit')
		.matches(/^(?=.*[0-9])/);
	req.checkBody('password', 'be of at least length 8')
		.isLength({min: 8});
	req.checkBody('password', 'contain a special character')
		.matches(/^(?=.*[!\?&@#%\$\+\-\*/])/);
	req.checkBody('password2', 'Passwords do not match.')
		.equals(req.body.password);
		
	var errs = req.validationErrors();
	console.log('IN');
	console.log(errs);
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

module.exports = router;
