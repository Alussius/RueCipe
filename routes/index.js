let express  = require("express");
let router   = express.Router();
let passport = require("passport");
let User     = require("../models/user");

// LANDING PAGE
router.get("/", (req, res) => {
    res.render("landing");
});

// NEW REGISTRATION
router.get("/register", (req, res) => {
    res.render("register");
});

// CREATE USER IN THE DB
router.post("/register", (req, res) => {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
			req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, () => {
			req.flash("success", "Welcome to RueCamp " + user.username);
            res.redirect("/recipes");
        });
    });
});

// LOGIN USER
router.get("/login", (req, res) => {
    res.render("login");
});

// HANDLE LOGIN LOGIC
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/recipes",
        failureRedirect: "/login"
    }), (req, res) => {
});

// LOG OUT ROUTE
router.get("/logout", (req, res) => {
	req.flash("success", "You have successfully logged out");
    req.logout();
    res.redirect("/recipes");
});

module.exports = router;