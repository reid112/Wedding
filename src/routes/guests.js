const express = require('express');
const { checkAuthenticated } = require('../auth-helper');
const { Rsvp } = require('../models');
const router = express.Router();

// GET - Guests home page
router.get("/", checkAuthenticated, async (req, res) => {
    try {
        var rsvps = await Rsvp.find({});
        var attending = [];
        var notAttending = [];

        rsvps.forEach(function(rsvp) {
        if (rsvp.attending) {
            attending.push(rsvp);
        } else {
            notAttending.push(rsvp);
        }
        });

        res.render("pages/auth/guests", {
            attending: attending,
            notAttending: notAttending
        });
    } catch (e) {
        res.redirect("login");
        console.log(e);
    }
});

module.exports = router;