var express = require('express');
var router = express.Router();
var Course = require('../models/course');
var user_model = require('../models/user');
var User = user_model.User;
var generateExercice = require('../models/generateExercices');

router.get('/', function(req, res, next) {
	var session = req.session;
	if(session.userId) {
		Course.find({}, function(err, docs) {
			if(err) {
				console.log("find error");
				return;
			}

			res.render('courses', {
				courses: docs
			});
		});
	} else {
		res.redirect('/user/login');
	}
});

router.get('/lecture/:id/:lecid', function(req, res, next) {
	var session = req.session;

	if(session.userId) {
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
				CourseInfo: CourseInfo
			});
		});
	} else {
		res.redirect('/user/login');
	}
});
router.get('/exercice', function(req, res, next) {
	var session = req.session;
	/* find course from id and put it in */
	
	if(session.userId) {
		res.render('exercice_interface');
	} else {
		res.redirect('/user/login');
	}
});

router.post('/exercice', function(req, res, next) {
	console.log("Caught user exercice info");
	User.findOne({email: req.session.email}, function(err, user) {
		if(user.isVerified) {
			user.exercices.push(req.body);

			user.save(function(err) {
				if(err) { return res.status(500).send({msg: err.message}); }
			});
		}
	});
});

router.get('/exercice/getExercice', function(req, res, next) {
	User.findOne({email: req.session.email}, function(err, user) {
		exercice = generateExercice(user.exercices);
		res.json(JSON.stringify(exercice));
	});
});

router.get('/practice', function(req, res, next) {
	var session = req.session;
	console.log(session);
	if(session.userId) {
		res.render('course_interface');
	} else {
		res.redirect('/user/login');
	}
});

module.exports = router;
