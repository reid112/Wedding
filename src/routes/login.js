const express = require('express');
const passport = require('passport');
const { checkNotAuthenticated } = require('../auth-helper');
const router = express.Router();

// GET - login homepage
router.get("/", checkNotAuthenticated, (req, res) => {
    res.render("pages/login");
});

// POST - Call to log a user in
router.post("/", checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/guests',
    failureRedirect: '/login',
    failureFlash: true
}));

module.exports = router;