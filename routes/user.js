const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const {saveRedirectUrl} = require("../middleware.js");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});
router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const regUser=await User.register(newUser, password);
      req.login(regUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "User Registered Successfully!");
        res.redirect("/listings");
      })
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success","You have Logged In Successfully!");
    let redirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
  }
);

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You're Logged Out Now!");
        res.redirect("/listings")
    })
})



module.exports = router;
