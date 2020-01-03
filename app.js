const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const nodemailer = require('nodemailer');
const uuid = require('uuid/v1');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const url = process.env.DB_URL;
mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true,});

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

const Rsvp = mongoose.model("Rsvp", rsvpSchema);
const Invite = mongoose.model("Invite", inviteSchema);

app.get("/", (req, res) => {
  res.render("home")
});

app.post("/", (req, res) => {
  const email = req.body.email;
  const names = req.body.names;
  const numberAttending = req.body.numberAttending;
  const rsvpString = req.body.rsvp;
  const notes = req.body.notes;

  let rsvpBool = false

  if (rsvpString == "attending") {
    rsvpBool = true
  }

  const rsvp = {
    email : email,
    names : names,
    numberAttending : numberAttending,
    attending : rsvpBool,
    notes : notes
  };

  const transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS
      }
  });

  const message = {
      from: 'rsvp@brittaniandriley.com',
      to: 'brittaniandriley@gmail.com',
      subject: 'New RSVP!',
      text: 'Email: ' + email + '\nNames: ' + names + '\nAttending: ' + rsvpString + '\nNumber: ' + numberAttending + '\nNotes: ' + notes
  };

  transporter.sendMail(message, function(err, info) {
      if (err) {
        console.log(err)
      } else {
        console.log(info);
      }
  });

  Rsvp.create(rsvp, function(err, rsvp) {
      if (err){
          console.log(err);
          res.send(err)
      } else {
          res.json({success : "Success", status : 200});
          console.log(rsvp);
      }
  });
});

app.get("/guests-hidden", (req, res) => {
  Rsvp.find({}, function(err, rsvps) {
      var attending = [];
      var notAttending = [];

      rsvps.forEach(function(rsvp) {
        if (rsvp.attending) {
          attending.push(rsvp);
        } else {
          notAttending.push(rsvp);
        }
      });

      res.render("guests", {
            attending: attending,
            notAttending: notAttending
        })
    });
});

app.get("/invites-hidden", (req, res) => {
  res.render("invites")
});

app.post("/invites-hidden", (req, res) => {
  const guid = uuid();
  const email = req.body.email;
  const names = req.body.names;
  const number = req.body.number;

  const invite = {
    guid : guid,
    email : email,
    names : names,
    number : number
  };

  Invite.create(invite, function(err, invite) {
      if (err){
          console.log(err);
          res.send(err)
      } else {
          res.redirect("/invites-hidden");
          console.log(invite);
      }
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000
}

app.listen(port);
