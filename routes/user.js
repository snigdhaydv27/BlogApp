const express = require("express");
const router = express.Router();
const User = require('../models/user');

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
        return res.redirect('/');
    } catch (error) {
        console.error("Error in signup:", error);
        return res.status(500).send("An error occurred during signup.");
    }
});

// Route to handle user signin
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate user credentials
        const user = await User.matchPassword(email, password);

        if (!user) {
            return res.status(401).send("Invalid email or password.");
        }

        console.log("User:", user);
        return res.redirect('/');
    } catch (error) {
        console.error("Error in signin:", error);
        return res.status(500).send("An error occurred during signin.");
    }
});

module.exports = router;
