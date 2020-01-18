const express = require('express');
const nodemailer = require('nodemailer');
const { checkAuthenticated } = require('../auth-helper');
const { Invite } = require('../models');
const router = express.Router();

// POST - Used to send a single invite
router.post("/", checkAuthenticated, async (req, res) => {
  try {
    const guid = req.body.guid;
    const inviteQuery = await Invite.findOne({guid: guid});
    const invite = inviteQuery.toObject();

    console.log(guid);
    console.log(invite);

    if (invite != null) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
              user: process.env.GMAIL_USER,
              pass: process.env.GMAIL_PASS
          }
      });

      const url = process.env.HOST + '/invite/' + guid

      const message = {
          from: 'rsvp@brittaniandriley.com',
          to: invite.email,
          subject: 'Wedding Invite - Brittani and Riley!',
          html: invite.names +",<br/><br/>You are invited to our wedding! <a href='" + url + "'>View your invite</a> for the wedding details and use the form on the website to RSVP.<br/><br/> If you have any questions, feel free to reply to this email! <br/><br/>We hope to see you there!<br/>Brittani and Riley"
      };

      transporter.sendMail(message, function(err, info) {});

      res.json({success : "Success", status : 200});
    } else {
      res.json({error : "Error", status : 500});
    }
  } catch (e) {
    res.json({error : "Error", status : 500});
    console.log(e);
  }
});

module.exports = router;