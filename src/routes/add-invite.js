const express = require('express');
const uuid = require('uuid/v1');
const { checkAuthenticated } = require('../utils/auth-helper');
const { Invite } = require('../models');
const router = express.Router();

// GET - Add invite page
router.get("/", checkAuthenticated, (req, res) => {
    res.render("pages/auth/addInvite");
});
  
// POST - Add invitee to list (database)
router.post("/", checkAuthenticated, (req, res) => {
    const guid = uuid();
    const email = req.body.email;
    const names = req.body.names;
    const number = req.body.number;

    const invite = {
        guid : guid,
        email : email,
        names : names,
        number : number
    };

    Invite.create(invite, function(err, invite) {
        if (err){
            console.log(err);
            res.send(err)
        } else {
            res.json({success : "Success", status : 200});
        }
    });
});

module.exports = router;