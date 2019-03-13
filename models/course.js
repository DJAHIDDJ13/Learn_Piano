var mongoose = require('mongoose');

var LectureSchema = new mongoose.Schema({
		name: {
			type: String,
			required: true
		},
		order: {
			type: Number,
			required: true
		},
		content: String
});

var CourseSchema = new mongoose.Schema({
		name: {
			type: String,
			required: true
		},
		difficulty: String,
		lectures: Array,
		exercices: Array
});

var Course = mongoose.model('Course', CourseSchema);
var Lecture = mongoose.model('Lecture', LectureSchema);

// export the models
module.exports = {
	Course: Course,
	Lecture: Lecture
}
