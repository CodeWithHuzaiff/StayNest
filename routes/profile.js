const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Profile = require("../models/profile.js");

//contacts route
router.get("/contacts",wrapAsync(async (req, res) => {
    const user = await Profile.findOne();
    res.render("contacts.ejs",{user});
  }));
  
  //profile route
  router.get("/", wrapAsync(async (req, res, next) => {
      const user = await Profile.findOne();
      if (!user) {
        return next(new ExpressError(404,"User not found"));
      }
      res.render("profile.ejs", { user });
  
  }));
  
  //Edit profile route
  router.get("/edit/:id",wrapAsync( async (req, res) => {
    const { id } = req.params;
    user = await Profile.findById(id);
    res.render("profileEdit.ejs", { user });
  }));
  
  router.put("/",wrapAsync(async (req, res) => {
    const user = await Profile.findOne();
    const { name, email, phone, location, password } = req.body;
    const updateUser = {
      name,
      email,
      phone,
      location,
      password,
    };
  
    if (user.password != password) {
      res.send("Incorrect Password!!");
    }
    user.name = name;
    user.phone = phone;
    user.location = location;
  
    await user.save();
    req.flash("success","Profile Updated") //flash msgr
    res.redirect("/profile");
  }));

module.exports = router;