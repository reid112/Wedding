const express = require('express');
const router = express.Router();

// GET - home page (will redirect to login).
router.get("/", (req, res) => {
    res.redirect("/login");
});

module.exports = router;