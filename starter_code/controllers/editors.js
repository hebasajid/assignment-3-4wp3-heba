const express = require('express');
var router = express.Router()
const ArticlesModel = require('../models/articles.js');
const UsersModel = require('../models/users');

// displauying  editors page
router.get("/", async function(req, res)
{
  if (!req.session.username || req.session.level !== 'editor') {
        req.session.login_error = "You must be an editor to access this page.";

        const allUsers = await UsersModel.getAllUsers(); 
        const allArticles = await ArticlesModel.getAllArticles();

            //passing list of users and articles to template to dosplay:
            req.TPL.allUsers = allUsers;
            req.TPL.allArticles = allArticles;
            req.TPL.username = req.session.username;

            res.render("editors", req.TPL);

        return res.redirect("/login");
    }

  res.render("editors", req.TPL);
});

module.exports = router;
