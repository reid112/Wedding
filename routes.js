const express = require('express');
const nodemailer = require('nodemailer');
const passport = require('passport');
const router = express.Router();

const User = require('./models/User');
const Rsvp = require('./models/Rsvp');
const Invite = require('./models/Invite');

router.use(function timeLog(req, res, next) {
  next();
});

router.get("/", (req, res) => {
  res.render("home")
});

router.post("/", (req, res) => {
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

router.get("/guests", checkAuthenticated, (req, res) => {
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

router.get("/invites", checkAuthenticated, (req, res) => {
  res.render("invites")
});

router.post("/invites", checkAuthenticated, (req, res) => {
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
          res.json({success : "Success", status : 200});
          console.log(invite);
      }
  });
});

router.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login");
});

router.post("/login", checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/guests',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get("/logout", checkAuthenticated, (req, res) => {
  res.render("logout");
});

router.delete('/logout', (req, res) => {
  req.logOut();
  res.redirect('/login');
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/guests')
  }
  next()
}

module.exports = router;
