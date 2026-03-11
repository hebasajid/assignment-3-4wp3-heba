const express = require('express');
var router = express.Router()
const ArticlesModel = require('../models/articles.js')
const UsersModel = require('../models/users.js'); //importing user model to use its functions for login

const bcrypt = require('bcrypt'); //importing bcrypt for password hashing
const saltRounds = 10; //number of salt rounds for bcrypt

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
    if (user) {
    // using bcrypt to compare the plaintext password w/  stored hash
    const match = await bcrypt.compare(password, user.password);

    if (match) {
        req.session.username = user.username;
        req.session.level = user.level;

        // redirecting based on level
        if (user.level === "member") {
            res.redirect("/members");
        } else if (user.level === "editor") {
            res.redirect("/editors");
        }
    } else {
        // passwords didn't match
        req.session.login_error = "Invalid username and/or password!";
        res.redirect("/login");
    }
} else {
    // user not found
    req.session.login_error = "Invalid username and/or password!";
    res.redirect("/login");
}
  }
  catch (err) { 
        console.error("Login Error:", err);
        req.session.login_error = "An internal server error occurred.";
        res.redirect("/login");
    }
  
});


// Logout a user
// - Destroys the session key username that is used to determine if a user
// is logged in, re-directs them to the home page.
router.get("/logout", async function(req, res)
{
  delete(req.session.username);
  res.redirect("/home");
});

//dispalying sign up page:
router.get("/signup", async function(req, res)
{
  res.render("signup", req.TPL);
});


//signup a user
router.post("/signup", async function(req, res)
{
  const { username, password } = req.body;

  if (username.length < 6 || password.length < 6) {
        req.TPL.login_error = "Username/password cannot be less than 6 characters in length!";
        return res.render("signup", req.TPL); 
    }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds); //hashing the password before storing it in the database

    await UsersModel.createUser(username, hashedPassword, 'member'); //storing the hashed password in the database instead of the plain text password
    
    req.TPL.message = "User account created! Login to access your account";
    res.render("login", req.TPL);
  }

    catch (err) { 
      console.error(err);
      res.redirectl("/login");
    }
});





module.exports = router;
