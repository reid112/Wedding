var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const rsvpSchema = {
  guid: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  attending: {
    type: Boolean,
    required: true
  },
  names: String,
  numberAttending: Number,
  notes: String
};

module.exports = mongoose.model('Rsvp', rsvpSchema);
