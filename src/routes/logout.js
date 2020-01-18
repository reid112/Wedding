const express = require('express');
const { checkAuthenticated } = require('../auth-helper');
const router = express.Router();


// GET - the logout homepage
router.get("/", checkAuthenticated, (req, res) => {
    res.render("pages/auth/logout");
});

// DELETE - call to log a user out
router.delete('/', (req, res) => {
    req.logOut();
    res.redirect('/login');
});

module.exports = router;