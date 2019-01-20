var express = require('express');
var router = express.Router();

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
		var userLogin = {
			email: req.body.email,
			password: req.body.password
		};
		res.redirect('/');
	}
});
module.exports = router;
