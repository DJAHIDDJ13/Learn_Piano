var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressValidator = require('express-validator');
var session = require('express-session');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var courseRouter = require('./routes/course');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator());

// mongoose middleware
mongoose.connect('mongodb://127.0.0.1/piano_db', {useNewUrlParser: true});
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.set();
var db = mongoose.connection;

app.use(session({
	secret: 'work hard',
	resave: true,
	saveUninitialized: false,
	store: new MongoStore({
		mongooseConnection: db
	})
}));

// routes 
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/course', courseRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// db error handler
db.on('error', console.error.bind(console, 'Mongodb connection error!'));
db.once('open', function() {
	console.log('Connected to database');
});

module.exports = app;
module.exports.db = db;

