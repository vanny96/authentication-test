var createError = require('http-errors');
var express = require('express');
var session = require("express-session");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Configure mongoose

var mongoose = require('mongoose');
var mongoDb = 'mongodb://localhost:27017/authproject';
mongoose.connect(mongoDb, {useNewUrlParser: true});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

// Configure passport
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
require('./security/pass')(passport, LocalStrategy);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {  
  res.locals.currentUser = req.user;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter(passport));

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

module.exports = app;
