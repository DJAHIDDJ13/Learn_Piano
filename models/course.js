/**
 * The course mongo schema (the course text and image URLs are linked
 * in this model)
 */
var mongoose = require('mongoose');

var CourseSchema = new mongoose.Schema({
		order: Number,
		courseName: {
			type: String,
			required: true
		},
		info: String,
		lectures: Array
}, {collection: "courses"});

var Course = mongoose.model('Course', CourseSchema);

// export the model
module.exports = Course;
