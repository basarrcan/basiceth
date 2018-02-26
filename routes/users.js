const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const Web3 = require('web3');

const web3 = new Web3('http://localhost:8545');


//Bring in User Model
let User = require('../models/user');

// Register form
router.get('/register', function(req, res){
  res.render('register');
});

// Register Proccess
router.post('/register', function(req,res){

  const newAccount = web3.eth.accounts.create();

  const email = req.body.email;
  const username = req.body.username;
  const address = newAccount.address;
  console.log("new account: " + newAccount.privateKey);

  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();

  let errors = req.validationErrors();

  if(errors){
    res.render('register', {
      errors:errors
    });
  } else {
    let newUser = new User({
      email:email,
      username:username,
      address:address
    });
    console.log("new user: "+ newUser)


    newUser.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success', 'You are now registered and can login!');
        res.redirect('/users/login');
      }
    });
  }
});

//Login form
router.get('/login', function(req,res){
  res.render('login');
});

//Login form
router.get('/logout', function(req,res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/users/login');
});

// Login Proccess
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })( req, res, next);
});
router.get('/profile', ensureAuthenticated, function(req,res){
  web3.eth.getBalance(req.user.address, (error, result) => {
    if(error){
      console.log(error);
    }else {
      res.render('profile', {
        title: "Profile",
        user: req.user,
        balance: result
      });
    }
  });
});

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
