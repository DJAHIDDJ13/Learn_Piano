var express = require('express');
var router = express.Router();
var course_model = require('../models/course');
var Course = course_model.Course;
var Lecture = course_model.Lecture;


router.get('/', function(req, res, next) {
	var session = req.session;
	console.log(session);
	if(session.userId) {
		res.render('courses', {
			courses: [
				{
					id: "",
					name: "course1",
					info: "this is info about course one "+
						  "this is info about course one "+
						  "this is info about course one.",
				},
				{
					id: "",
					name: "course2",
					info: "this is info about course two "+
						  "this is info about course two "+
						  "this is info about course two.",
				},
				{
					id: "",
					name: "course3",
					info: "this is info about course three "+
						  "this is info about course three "+
						  "this is info about course three.",
				},
				{
					id: "",
					name: "course3",
					info: "this is info about course three "+
						  "this is info about course three "+
						  "this is info about course three.",
				},
				{
					id: "",
					name: "course3",
					info: "this is info about course three "+
						  "this is info about course three "+
						  "this is info about course three.",
				},
				{
					id: "",
					name: "course3",
					info: "this is info about course three "+
						  "this is info about course three "+
						  "this is info about course three.",
				},
				{
					id: "",
					name: "course3",
					info: "this is info about course three "+
						  "this is info about course three "+
						  "this is info about course three.",
				},
				{
					id: "",
					name: "course3",
					info: "this is info about course three "+
						  "this is info about course three "+
						  "this is info about course three.",
				},
				{
					id: "",
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

router.get('/lecture/:id/:lecid', function(req, res, next) {
	var session = req.session;
	/* find course from id and put it in */
	var CourseInfo = {
		id: req.params.id
	};
	/* course list */
	var CourseElems = [
		"elem1",
		"elem2",
		"elem3"
	];
	
	/* get lecture from lecid */
	var LectureCont = {
		name: "Lecture1",
		order: parseInt(req.params.lecid),
		content: "Lecture1Lecture1Lecture1Lecture1Lectu"+
			"re1Lecture1Lecture1Lecture1Lecture1\nLecture1Lecture1Lecture1"
	}
	
	if(session.userId) {
		res.render('course_interface', {
			CourseElems: CourseElems,
			Lecture: LectureCont,
			CourseInfo: CourseInfo
		});
	} else {
		res.redirect('/user/login');
	}
});
router.get('/lecture/:id/:lecid/exercice', function(req, res, next) {
	var session = req.session;
	/* find course from id and put it in */
	var CourseInfo = {
		id: req.params.id
	};

	/* get lecture from lecid */
	var LectureCont = {
		name: "Lecture1",
		order: parseInt(req.params.lecid),
		content: "Lecture1Lecture1Lecture1Lecture1Lectu"+
			"re1Lecture1Lecture1Lecture1Lecture1\nLecture1Lecture1Lecture1"
	}
	
	var ExerciceScript = {
		play: [
			[80, 4, "Hello"], // note, duration, text
			[70, 4, "Hello"], 	
			[60, 4, "Hello"], 	
			[50, 4, "Hello"]
		]
	}
	
	if(session.userId) {
		res.render('exercice_interface', {
			Lecture: LectureCont,
			CourseInfo: CourseInfo,
			
		});
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
