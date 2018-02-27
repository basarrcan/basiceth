const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');
const Web3 = require('web3');

const web3 = new Web3('http://localhost:8545');

module.exports = function(passport){
  //local Strategy
  passport.use(new LocalStrategy(function(username, password, done){
    //Match Username
    console.log("giriş deneme")
    let query = {username:username};
    User.findOne(query, function(err, user){
      if(err) throw err;
      if(!user){
        return done(null, false, {message:'No user found'});
      }
      let pubkey = web3.eth.accounts.privateKeyToAccount(password).address;
      console.log(password);
      console.log(pubkey);
      // Match password

      if(pubkey == user.address){
        return done(null, user);
      } else {
        return done(null, false, {message: 'Wrong key'})
      }
      
    });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}
