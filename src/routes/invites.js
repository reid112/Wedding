const express = require('express');
const { checkAuthenticated } = require('../auth-helper');
const { Invite, Rsvp } = require('../models');
const router = express.Router();

// GET - Invites home page
router.get("/", checkAuthenticated, async (req, res) => {
    try {
        const invites = await Invite.find({});
        const rsvps = await Rsvp.find();
        res.render("pages/auth/invites", {invites: invites, rsvps: rsvps, host: process.env.HOST});
    } catch (e) {
        res.redirect("guests");
        console.log(e);
    }
});

module.exports = router;