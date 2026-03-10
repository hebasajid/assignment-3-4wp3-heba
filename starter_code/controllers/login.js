const express = require('express');
var router = express.Router()
const ArticlesModel = require('../models/articles.js')
const UsersModel = require('../models/users.js'); //importing user model to use its functions for login

// Displays the login page
router.get("/", async function(req, res)
{
  // if we had an error during form submit, display it, clear it from session
  req.TPL.login_error = req.session.login_error;
  req.session.login_error = "";

  // render the login page
  res.render("login", req.TPL);
});

// Attempts to login a user
// - The action for the form submit on the login page.
router.post("/attemptlogin", async function(req, res)
{

  const { username, password } = req.body;

  try {
    const user = await UsersModel.findByUsername(username);

    //checking if the user exists and if the password matches
    if (user && user.password === password) {
      req.session.username = user.username; // storing the users info within the session to keep them logged in
      req.session.level = user.level; 

      // redirection based on user level
            if (user.level === "member") { //redurecting members to the members page, and editors to the editors page
                res.redirect("/members");
            } else if (user.level === "editor") {
                res.redirect("/editors"); 
            }

    } else {
      req.session.login_error = "Invalid username and/or password!"; //  error message in session
      res.redirect("/login"); // Redirect back to login page on failure
    }
  } catch (err) {
    console.error("Login error:", err);
    res.redirect("/login");
  }

  // // is the username and password OK?
  // if (req.body.username == "bob" &&
  //     req.body.password == "test")
  // {
  //   // set a session key username to login the user
  //   req.session.username = req.body.username;

  //   // re-direct the logged-in user to the members page
  //   res.redirect("/members");
  // }
  // else
  // {
  //   // if we have an error, reload the login page with an error
  //   req.session.login_error = "Invalid username and/or password!";
  //   res.redirect("/login");
  // }

});

// Logout a user
// - Destroys the session key username that is used to determine if a user
// is logged in, re-directs them to the home page.
router.get("/logout", async function(req, res)
{
  delete(req.session.username);
  res.redirect("/home");
});

//signup a user
router.post("/signup", async function(req, res)
{
  const { username, password } = req.body;

  if (username.length < 6 || password.length < 6) {
        req.TPL.login_error = "Username/password cannot be less than 6 characters in length!";
        return res.render("login", req.TPL); 
    }

    await UsersModel.createUser(username, password, 'member');
    
    req.TPL.message = "User account created! Login to access your account";
    res.render("login", req.TPL);
});

module.exports = router;
