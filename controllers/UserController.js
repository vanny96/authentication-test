var User = require('../models/user');
var bcrypt = require('bcryptjs');

exports.users_list = function(req, res, next){
    User.find()
    .exec(function(err, result){
        if(err) {return next(err)}

        res.render('users', {title: 'Users', users: result});
    })
}

exports.users_new = function(req, res, next){
    res.render('userform', {title: "User Form"});
}

exports.users_create = function(req, res, next){
    bcrypt.hash(req.body.password, 10, function(err, hash){
        var user = new User({
            username: req.body.username,
            password: hash
        })

        user.save(function(err){
            if(err){return next(err)}
            res.redirect('/users');
        })
    })
}

exports.users_login = function(req, res, next){
    res.render('userlogin', {title: 'User Login'});
}