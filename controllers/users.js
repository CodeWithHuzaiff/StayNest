const User = require("../models/user.js");

module.exports.renderSignupForm=(req, res) => {
    res.render("users/signup.ejs");
  }


module.exports.signup=async (req, res) => {
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
  }



module.exports.renderLoginForm=(req, res) => {
    res.render("users/login.ejs");
  }
module.exports.login=async (req, res) => {
    req.flash("success","You have Logged In Successfully!");
    let redirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
  }


module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You're Logged Out Now!");
        res.redirect("/listings")
    })
}