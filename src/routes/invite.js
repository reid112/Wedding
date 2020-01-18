const express = require('express');
const { Invite, Rsvp } = require('../models');
const router = express.Router();

// GET - the homepage for a specific invite
router.get("/:guid", async (req, res) => {
  const guid = req.params.guid;

  try {
    const inviteQuery = await Invite.findOne({guid: guid});
    const rsvpQuery = await Rsvp.findOne({guid: guid});

    const invite = (inviteQuery != null) ? inviteQuery.toObject() : null;
    const rsvp = (rsvpQuery != null) ? rsvpQuery.toObject() : null;

    if (invite == null) {
      res.send("");
    } else {
      res.render("pages/home", {rsvp: rsvp, guid: invite.guid, names: invite.names, number: invite.number})
    }
  } catch (e) {
    res.send("");
    console.log(e);
  }
});

module.exports = router;