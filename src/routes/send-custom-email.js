const express = require('express');
const sendEmail = require('../utils/send-email');
const { createCustomEmail } = require('../utils/create-email');
const { checkAuthenticated } = require('../utils/auth-helper');
const { Invite } = require('../models');
const router = express.Router();

// POST - Used to send a custom email to all email addresses on invite list
router.post("/", checkAuthenticated, async (req, res) => {
  try {
    const subject = req.body.subject;
    const message = req.body.message;
    const invites = await Invite.find({});

    invites.forEach(function (invite) {
        console.log(invite.email);
        console.log(subject);
        console.log(message);
        sendEmail(createCustomEmail(invite.email, subject, message));
    });

    res.json({success : "Success", status : 200});
  } catch (e) {
    console.log(e);
    res.json({error : "Error", status : 500});
  }
});

module.exports = router;