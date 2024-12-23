const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Route to render the signin page
router.get("/signin", (req, res) => {
  return res.render("signin");
});

// Route to render the signup page
router.get("/signup", (req, res) => {
  return res.render("signup");
});

// Route to handle user signup
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    // Create the user in the database
    await User.create({
      fullName,
      email,
      password,
    });
    return res.redirect("/");
  } catch (error) {
    console.error("Error in signup:", error);
    return res.status(500).send("An error occurred during signup.");
  }
});

// Route to handle user signin
router.post("/signin", async (req, res) => {
    const { password , email  } = req.body;
    try {
        const token =await User.matchPasswordAndGenerateToken(email,password);
        console.log("Token",token);
        return res.cookie('token',token).redirect('/');
    } catch (error) {
        return res.render('signin',{
            error:"Incorrect Email or Password",
        });
    }
});

module.exports = router;
