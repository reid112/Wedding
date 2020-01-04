var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const userSchema = {
  user_id: {
    type: Number,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
};

module.exports = mongoose.model('User', userSchema);
