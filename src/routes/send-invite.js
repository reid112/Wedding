const express = require('express');
const sendEmail = require('../utils/send-email');
const { checkAuthenticated } = require('../utils/auth-helper');
const { Invite } = require('../models');
const router = express.Router();

// POST - Used to send a single invite
router.post("/", checkAuthenticated, async (req, res) => {
  try {
    const guid = req.body.guid;
    const inviteQuery = await Invite.findOne({guid: guid});
    const invite = inviteQuery.toObject();

    if (invite != null) {
      const url = process.env.HOST + '/invite/' + guid

      const message = {
          from: 'rsvp@brittaniandriley.com',
          to: invite.email,
          subject: 'Wedding Invite - Brittani and Riley!',
          html: invite.names +",<br/><br/>You are invited to our wedding! <a href='" + url + "'>View your invite</a> for the wedding details and use the form on the website to RSVP.<br/><br/> If you have any questions, feel free to reply to this email! <br/><br/>We hope to see you there!<br/>Brittani and Riley"
      };

      sendEmail(message);

      res.json({success : "Success", status : 200});
    } else {
      res.json({error : "Error", status : 500});
      console.log("Invite could not be found!");
    }
  } catch (e) {
    res.json({error : "Error", status : 500});
    console.log(e);
  }
});

module.exports = router;