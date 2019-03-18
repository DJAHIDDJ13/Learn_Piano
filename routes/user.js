/**
 * Handles routes for the /user page
 * that includes all the login, signup and verification POSTs
 * 
 */
var express = require('express');
var nodemailer = require('nodemailer');
var crypto = require('crypto');

var router = express.Router();
var user_model = require('../models/user');
var User = user_model.User;
var Token = user_model.Token;

// login
router.get('/login', function(req, res, next) {
	res.render('login', {errors: []});
});

router.post('/login', function(req, res, next) {
	// check and sanitize the input
	req.checkBody('email', 'Invalid email') 
		.isEmail().normalizeEmail();
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

	var errs = req.validationErrors();
	if(errs) {
		// handle format errs, ex: email not valid 
		res.render('login', {
			email: req.body.email,
			password: req.body.password,
			errors: errs
		});
	} else {
		// authenticate using the function created in the model
		User.authenticate(req.body.email, req.body.password, function(err, user) {
			if(err || !user) {
				// no user found or not confirmed
				res.render('login', {
					email: req.body.email,
					password: req.body.password,
					errors: [{msg: "Wrong email or password", param: "auth"}]
				});
			} else {
				// create session and redirect to home
				req.session.userId = user._id;
				req.session.email = user.email;
				return res.redirect('/');
			}
		});
	}
});

// signup
router.get('/signup', function(req, res, next) {
	res.render('signup', {errors: []});
});

// handle post reqs for creating account
router.post('/signup', function(req, res, next) {
	// check and sanitize the input
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
	if(errs) {
		// handle format errs, ex: email not valid 
		res.render('signup', {
			username: req.body.username,
			email: req.body.email,
			password: req.body.password,
			errors: errs
		});
	} else {
		// create a new user that is not confirmed yet
		var userData = {
			email: req.body.email,
			username: req.body.username,
			password: req.body.password,
			isVerified: true
		};

		User.create(userData, function(err, user) {
			if(err) {
				// user already exists
				res.render('signup', {
					username: req.body.username,
					email: req.body.email,
					password: req.body.password,
					errors: [{param: 'duplicate'}]
				});
			} else {
				//~ // create new token
				//~ let tok = new Token({
					//~ _userId: user._id,
					//~ token: crypto.randomBytes(16).toString('hex')
				//~ });
				
				//~ // save the token to the db
				//~ tok.save(function(err) {
					//~ if(err) { return res.status(500).send({msg: err.message}) }
					//~ // connect to the mail server
					//~ const transporter = nodemailer.createTransport({
						//~ host: 'smtp.ethereal.email',
						//~ port: 587,
						//~ secure: false,
						//~ auth: {
							//~ user: 'gaetano51@ethereal.email',
							//~ pass: 'E18PJc41MA4EanzDAt'
						//~ }
					//~ });
					//~ var mailOptions = {
						//~ from: 'gaetano51@ethereal.email',
						//~ to: user.email,
						//~ subject: '[Learn piano] Verify your account',
						//~ text: 'Hello, \n\n' + 
							 //~ 'Please verify your account by clicking this link: \nhttp:\/\/'+
							//~ req.headers.host + '\/user\/confirmation\/' + tok.token + '.\n'
					//~ };

					//~ // send the mail
					//~ transporter.sendMail(mailOptions, function(err) {
						//~ if(err) { return res.status(500).send({msg: err.message}); }
						//~ res.redirect('/user/confirmation');
					//~ });
				//~ });
				res.redirect('/user/login');
			}
		});
	}
});

// verification
router.get('/confirmation/:token', function(req, res, next) {
	// get the token from the url eg: get request
	res.render('confirmation', {token: req.params.token, email: false});
});

// resending the token
router.get('/confirmation', function(req, res, next) {
	res.render('confirmation', {email: false});
});

// confirm the account
router.post('/confirmation', function(req, res, next) {
	// checking input fields
	req.checkBody('email', 'Invalid email')
		.isEmail().normalizeEmail();
	// we get from the url eg a get request
	req.checkBody('token', 'Token cannot be blank')
		.notEmpty();
		
	var errs = req.validationErrors();
	if(errs) {
		// handling format errors
		console.log(errs);
		res.render('confirmation', {
			email: true,
			token: req.body.token
		});
	} else {
		// find our token in the token schema
		Token.findOne({ token: req.body.token }, function(err, token) {
			if(!token) { return res.status(400).send({ type: 'unverified', msg: 'We were unable to match your token. It may have expired!'}); }
			// if found find the corresponding user
			User.findOne({ _id: token._userId, email: req.body.email }, function(err, user) {
				if(!user) { return res.status(400).send({ type: 'already-verified', msg: 'This account has already been verified'}); }
				// if the user if found verify his account
				user.isVerified = true;
				// and save to the db
				user.save(function(err) {
					if(err) { return res.status(500).send({msg: err.message}); }
					res.render('login', {errors: []});
				});
			});
		});
	}
});


router.post('/resend', function(req, res, next) {
	// checking input fields
	req.checkBody('email', 'Invalid email')
		.isEmail().normalizeEmail();
	var errs = req.validationErrors();
	if(errs) {
		// handling format errors
		console.log(errs);
		res.render('confirmation', {
			email: true,
			token: req.body.token
		});
	} else {
		User.findOne({email: email}, function(err, user) {
			if(!user || err) { return res.status(500).send({msg: 'could not resend confirmation'}); }
			// create new token
			let tok = new Token({
				_userId: user._id,
				token: crypto.randomBytes(16).toString('hex')
			});
			
			// save the token to the db
			tok.save(function(err) {
				if(err) { return res.status(500).send({msg: err.message}) }
				// connect to the mail server
				const transporter = nodemailer.createTransport({
					host: 'smtp.ethereal.email',
					port: 587,
					auth: {
						user: 'lionel.gutkowski69@ethereal.email',
						pass: 'ywkcZmCqJdX88h9zPr'
					}
				});
				var mailOptions = {
					from: 'lionel.gutkowski69@ethereal.email',
					to: user.email,
					subject: '[Learn piano] Verify your account',
					text: 'Hello, \n\n' + 
						 'Please verify your account by clicking this link: \nhttp:\/\/'+
						req.headers.host + '\/user\/confirmation\/' + tok.token + '.\n'
				};

				// send the mail					
				transporter.sendMail(mailOptions, function(err) {
					if(err) { return res.status(500).send({msg: err.message}); }
					res.redirect('/user/confirmation');
				});
			});
		});
	}
});

module.exports = router;
