const express = require('express');
const sendEmail = require('../utils/send-email');
const { createRsvpEmail } = require('../utils/create-email');
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
        const isNewRsvp = (rsvpQuery == null);

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

        sendEmail(createRsvpEmail({
            ...rsvp,
            isNewRsvp,
        }));

        if (isNewRsvp) {
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
        res.send(e)
        console.log(e);
    }
});

module.exports = router;