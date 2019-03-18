var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	var session = req.session;
	
	res.render('index', {
		title: "Express",
		logged: session.email != ''
	});
});

module.exports = router;
