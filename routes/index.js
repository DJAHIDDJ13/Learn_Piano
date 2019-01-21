var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('index', {
		title: "Express"
	});
});


router.get('/course', function(req, res, next) {
	res.render('course_interface');
});

module.exports = router;
