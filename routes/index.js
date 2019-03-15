/**
 * Handle routes for the main page eg: /
 */

var express = require('express');
var router = express.Router();

/* handle the get request for the / page */
router.get('/', function(req, res, next) {
	var session = req.session;
	
	res.render('index', { // this function searches the views directory for a jade view and renders it
		title: "Learn Piano",
		logged: session.email != '' // these are parameters that can be sent to the jade page
	});
});

module.exports = router;
