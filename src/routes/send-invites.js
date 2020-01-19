const express = require('express');
const sendEmail = require('../utils/send-email');
const { createInviteEmail } = require('../utils/create-email');
const { checkAuthenticated } = require('../utils/auth-helper');
const { Invite } = require('../models');
const router = express.Router();

// POST - Used to send all invites
router.post("/", checkAuthenticated, async (req, res) => {
  try {
    const invites = await Invite.find({});

    invites.forEach(function (invite) {
      sendEmail(createInviteEmail(invite));
    });

    res.json({success : "Success", status : 200});
  } catch (e) {
    console.log(e);
    res.json({error : "Error", status : 500});
  }
});

module.exports = router;