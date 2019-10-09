var express = require('express');
var userController = require('../controllers/UserController');

module.exports = function (passport) {
  var router = express.Router();

  /* GET users listing. */
  router.get('/', userController.users_list);
  router.get('/new', userController.users_new);
  router.post('/new', userController.users_create);
  router.get('/login', userController.users_login);
  router.post('/login', passport.authenticate("local", {
    successRedirect: "/users",
    failureRedirect: "/users/login"
  })
  );
  router.get('/logout', function(req, res){
    req.logout();
    res.redirect("/users");
  })

  return router;
}
