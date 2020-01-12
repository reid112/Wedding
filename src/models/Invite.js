var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const inviteSchema = {
  guid: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  names: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    required: true
  }
};

module.exports = mongoose.model('Invite', inviteSchema);
