const express = require('express');
const sendEmail = require('../utils/send-email');
const { createInviteEmail } = require('../utils/create-email');
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
      sendEmail(createInviteEmail(invite));
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