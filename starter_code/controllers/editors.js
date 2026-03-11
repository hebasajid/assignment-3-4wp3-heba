const express = require('express');
var router = express.Router()
const ArticlesModel = require('../models/articles.js');

// Display the editors page
router.get("/", async function(req, res)
{
  if (!req.session.username || req.session.level !== 'editor') {
        req.session.login_error = "You must be an editor to access this page.";
        return res.redirect("/login");
    }

  res.render("editors", req.TPL);
});

module.exports = router;
