var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	var session = req.session;
	console.log(session);
	if(session.userId) {
		res.render('courses', {
			courses: [
				{
					name: "course1",
					info: "this is info about course one "+
						  "this is info about course one "+
						  "this is info about course one.",
				},
				{
					name: "course2",
					info: "this is info about course two "+
						  "this is info about course two "+
						  "this is info about course two.",
				},
				{
					name: "course3",
					info: "this is info about course three "+
						  "this is info about course three "+
						  "this is info about course three.",
				},
				{
					name: "course3",
					info: "this is info about course three "+
						  "this is info about course three "+
						  "this is info about course three.",
				},
				{
					name: "course3",
					info: "this is info about course three "+
						  "this is info about course three "+
						  "this is info about course three.",
				},
				{
					name: "course3",
					info: "this is info about course three "+
						  "this is info about course three "+
						  "this is info about course three.",
				},
				{
					name: "course3",
					info: "this is info about course three "+
						  "this is info about course three "+
						  "this is info about course three.",
				},
				{
					name: "course3",
					info: "this is info about course three "+
						  "this is info about course three "+
						  "this is info about course three.",
				},
				{
					name: "course3",
					info: "this is info about course three "+
						  "this is info about course three "+
						  "this is info about course three.",
				}
			]
		});
	} else {
		res.redirect('/user/login');
	}
});

router.get('/:id', function(req, res, next) {
	var session = req.session;
	console.log(session);
	if(session.userId) {
		
	} else {
		res.redirect('/user/login');
	}
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
