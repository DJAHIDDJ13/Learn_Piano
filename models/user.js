var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

// user account schema
var UserSchema = new mongoose.Schema({
		email: {
			type: String,
			unique: true,
			required: true,
			trim: true
			
		},
		username:  {
			type: String,
			required: true,
			trim: true
		},
		password: {
			type: String,
			required: true
		},
		isVerified: {
			type: Boolean,
			default: false
		},
		passwordResetToken: String,
		passwordResetExpires: Date
});

// token schema used for verifying by email
const tokenSchema = new mongoose.Schema({
	_userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	token: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
		expires: 43200 // expires after 12 hours
	}
});

// authenticate the user
UserSchema.statics.authenticate = function(email, password, callback) {
	User.findOne({email: email}) // find instance of the email
		.exec(function(err, user) {
			if(err) {
				return callback(err)
			} else if(!user) {
				var err = new Error('User not found.'); // user doesn't exist
				err.status = 401;
				return callback(err);
			} else if(!user.isVerified) {
				var err = new Error('User not verified.'); // user not verified
				err.status = 401;
				return callback(err);
			}
			
			bcrypt.compare(password, user.password, function(err, result) {
				if(result === true) {
					return callback(null, user); // the password matches the hashed password
				} else {
					return callback();
				}
			});
		});
};

// hash passwords before saving them to the db
UserSchema.pre('save', function(next) {
	var user = this;
	if(!user.isModified('password')) { return next(); }
	bcrypt.hash(user.password, 10, function(err, hash) {
		if(err) {
			return next(err);
		} 
		user.password = hash;
		next();
	});
});

var User = mongoose.model('User', UserSchema);
var Token = mongoose.model('Token', tokenSchema);

// export the models
module.exports = {
	User: User,
	Token: Token
}
