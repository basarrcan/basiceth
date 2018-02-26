const mongoose = require('mongoose');

//User Schema
const UserSchema = mongoose.Schema({
  email:{
    type: String,
    required: true
  },
  username:{
    type: String,
    required: true
  },
  address:{
    type: String,
    required: true
  }
});

const User = module.exports = mongoose.model('User', UserSchema);
