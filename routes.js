const express = require('express');
const nodemailer = require('nodemailer');
const passport = require('passport');
const uuid = require('uuid/v1');
const router = express.Router();

const User = require('./models/User');
const Rsvp = require('./models/Rsvp');
const Invite = require('./models/Invite');

router.use(function timeLog(req, res, next) {
  next();
});

router.get("/", (req, res) => {
  res.redirect("/login");
});

router.get("/invite/:guid", async (req, res) => {
  const guid = req.params.guid;

  try {
    const inviteQuery = await Invite.findOne({guid: guid});
    const rsvpQuery = await Rsvp.findOne({guid: guid});

    const invite = (inviteQuery != null) ? inviteQuery.toObject() : null;
    const rsvp = (rsvpQuery != null) ? rsvpQuery.toObject() : null;

    if (invite == null) {
      res.send("");
    } else {
      res.render("home", {rsvp: rsvp, guid: invite.guid, names: invite.names, number: invite.number})
    }
  } catch (e) {
    res.send("");
    console.log(e);
  }
});

router.post("/rsvp", async (req, res) => {
  const guid = req.body.guid;
  const name = req.body.name;
  const email = req.body.email;
  const rsvpString = req.body.rsvp;
  const numberAttending = req.body.numberAttending;
  const names = req.body.names;
  const notes = req.body.notes;

  try {
    const rsvpQuery = await Rsvp.findOne({guid: guid});
    const currentRsvp = (rsvpQuery != null) ? rsvpQuery.toObject() : null;

    let rsvpBool = false

    if (rsvpString == "attending") {
      rsvpBool = true
    }

    const rsvp = {
      guid : guid,
      name : name,
      email : email,
      attending : rsvpBool,
      numberAttending : numberAttending,
      names : names,
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
        subject: (currentRsvp == null) ? 'New RSVP!' : 'Updated RSVP!',
        text: 'Email: ' + email + '\nNames: ' + names + '\nAttending: ' + rsvpString + '\nNumber: ' + numberAttending + '\nNotes: ' + notes
    };

    transporter.sendMail(message, function(err, info) {});

    if (currentRsvp == null) {
      Rsvp.create(rsvp, function(err, rsvp) {
          if (err){
              res.send(err)
          } else {
              res.json({success : "Success", status : 200});
          }
      });
    } else {
      Rsvp.replaceOne(rsvp, function(err, rsvp) {
          if (err){
              res.send(err)
          } else {
              res.json({success : "Success", status : 200});
          }
      });
    }
  } catch (e) {
    res.send(err)
  }
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

router.get("/invites", checkAuthenticated, async (req, res) => {
  try {
    const invites = await Invite.find({});
    res.render("invites", {invites: invites});
  } catch (e) {
    res.redirect("guests");
  }
});

router.post("/send-invites", checkAuthenticated, async (req, res) => {
  try {
    const invites = await Invite.find({});

    const transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });

    invites.forEach(function (invite) {
      const url = process.env.HOST + '/invite/' + invite.guid

      const message = {
          from: 'rsvp@brittaniandriley.com',
          to: invite.email,
          subject: 'Wedding Invite - Brittani and Riley!',
          html: invite.names +",<br/><br/>You are invited to our wedding! Please visit <a href='" + url + "'>BrittaniAndRiley.com</a> for the wedding details and use the form on the website to RSVP.<br/><br/> If you have any questions, feel free to reply to this email! <br/><br/>We hope to see you there!<br/>Brittani and Riley"
      };

      transporter.sendMail(message, function(err, info) {});
    });

    res.json({success : "Success", status : 200});
  } catch (e) {
    console.log(e);
    res.json({error : "Error", status : 500});
  }
});

router.get("/add-invite", checkAuthenticated, (req, res) => {
  res.render("addInvite");
});

router.post("/add-invite", checkAuthenticated, (req, res) => {
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
