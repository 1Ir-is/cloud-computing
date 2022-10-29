var express = require('express');
var authen = require('../models/authenticator')
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ATN Shop' });
});
router.get('/login',function(req,res,next){
  res.render('login', { title: 'Login',
                        message: ''})
})
/* POST home page */
router.post('/',function(req,res,next){
  res.render('login', { title: 'Login',
                        message: 'Enter your account'})
})
/* POST login page */
router.post('/login', async function(req,res,next){
  let username = req.body.username;
  let password = req.body.password;
 // console.log(username+":"+password);
  var session = req.session;
  let [authenticated, shop_id, role] = await authen(username, password);
  if(authenticated){
    session.user_id = username;
    session.shop_id = shop_id;
    session.role = role;
    console.log(session.user_id,session.shop_id,session.role);
    if(role == 'shop'){
      res.redirect('/users');
    }
    if(role == 'director'){
      res.redirect('/admin')
    }
  }
  else{
    res.render('login', { title: 'Login',
                          message: 'Incorrect username or password'});
  }
})
router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
