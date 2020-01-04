var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const rsvpSchema = {
  email: {
    type: String,
    required: true
  },
  names: {
    type: String,
    required: true
  },
  numberAttending: {
    type: Number,
    required: true
  },
  attending: {
    type: Boolean,
    required: true
  },
  notes: String
};

module.exports = mongoose.model('Rsvp', rsvpSchema);
