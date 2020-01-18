const express = require('express');
const sendEmail = require('../utils/send-email');
const { checkAuthenticated } = require('../utils/auth-helper');
const { Invite } = require('../models');
const router = express.Router();

// POST - Used to send all invites
router.post("/", checkAuthenticated, async (req, res) => {
  try {
    const invites = await Invite.find({});

    invites.forEach(function (invite) {
      const url = process.env.HOST + '/invite/' + invite.guid

      const message = {
          from: 'rsvp@brittaniandriley.com',
          to: invite.email,
          subject: 'Wedding Invite - Brittani and Riley!',
          html: invite.names +",<br/><br/>You are invited to our wedding! <a href='" + url + "'>View your invite</a> for the wedding details and use the form on the website to RSVP.<br/><br/> If you have any questions, feel free to reply to this email! <br/><br/>We hope to see you there!<br/>Brittani and Riley"
      };

      sendEmail(message);
    });

    res.json({success : "Success", status : 200});
  } catch (e) {
    console.log(e);
    res.json({error : "Error", status : 500});
  }
});

module.exports = router;