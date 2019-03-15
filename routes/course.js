/**
 * Handle routes for the /course sub-route
 * handles POST and GET requests for the courses and the exercices
 */

var express = require('express');
var router = express.Router();
// getting the schemas from User and Course
var Course = require('../models/course'); 
var user_model = require('../models/user');
var User = user_model.User;
// and getting the function to generate the user exercice
var generateExercice = require('../models/generateExercices');

/* handles GET requests for /course which is the course list*/
router.get('/', function(req, res, next) {
	var session = req.session;
	if(session.userId) { // checking the session
		Course.find({}, function(err, docs) {
			if(err) {
				console.log("find error");
				return;
			}

			res.render('courses', {
				courses: docs,
				logged: true
			});
		});
	} else {
		res.redirect('/user/login');
	}
});

/* handles the requests for the course content note that the :lecid 
 * wasn't used because there were supposed to be multiple lectures 
 * per course */
router.get('/lecture/:id/:lecid', function(req, res, next) {
	var session = req.session;

	if(session.userId) { // session check
		Course.findOne({order: parseInt(req.params.id)}, function(err, doc) {
			if(err || !doc) {
				//~ console.log("find error");
				next();
				return;
			}
			/* find course from id and put it in */
			var CourseInfo = {
				id: req.params.id
			};
			/* get lecture from lecid */
			var LectureCont = doc.lectures[parseInt(req.params.lecid)];

			res.render('course_interface', {
				Lecture: LectureCont,
				CourseInfo: CourseInfo,
				logged: true
			});
		});
	} else {
		res.redirect('/user/login');
	}
});

/* handles requests for the main practice(exercice) page */
router.get('/exercice', function(req, res, next) {
	var session = req.session;
	/* find course from id and put it in */
	
	if(session.userId) { // session check
		res.render('exercice_interface', {logged: true});
	} else {
		res.redirect('/user/login');
	}
});

/* handles the user score POSTs 
 * When the user finishes the exercice they send a JSON containing
 * the score and the key presses and the exercice itself */
router.post('/exercice', function(req, res, next) {
	// find the user with the corresponding session 
	// note that the session of any post request is stored in
	// req.session which is handled by a dependecy called express-session
	User.findOne({email: req.session.email}, function(err, user) { 
		if(err || ! user) { return res.status(500).send({msg: err.message}); }
		if(user.isVerified) {
			user.exercices.push(req.body);

			user.save(function(err) { // save after pushing the exercice
				if(err) { return res.status(500).send({msg: err.message}); }
				return res.status(200).send({msg: 'success'});
			});
		}
	});
});

/* generate an exercice for the user when asked */
router.get('/exercice/getExercice', function(req, res, next) {
	User.findOne({email: req.session.email}, function(err, user) {
		exercice = generateExercice(user.exercices);
		res.json(JSON.stringify(exercice)); // the exercice is stringified and
		// then sent
	});
});

/* handles the practice page */
router.get('/practice', function(req, res, next) {
	var session = req.session;
	//~ console.log(session);
	if(session.userId) {
		res.render('course_interface', {logged: true});
	} else {
		res.redirect('/user/login');
	}
});

module.exports = router;
