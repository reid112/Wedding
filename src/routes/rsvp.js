const express = require('express');
const nodemailer = require('nodemailer');
const { Rsvp } = require('../models');
const router = express.Router();

// POST - Used to let a user RSVP
router.post("/", async (req, res) => {
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
            text: 'Name: ' + name + '\nEmail: ' + email + '\nAttending: ' + rsvpBool + '\nNumber: ' + numberAttending + '\nNames: ' + names + '\nNotes: ' + notes
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
        console.log(e);
    }
});

module.exports = router;