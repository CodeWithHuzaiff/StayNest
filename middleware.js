const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  let listing = await Listing.findById(id);

  if (!listing.author._id.equals(res.locals.currentUser._id)) {
    req.flash("error", "You aren't the owner of Listing!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
module.exports.listingValidation = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let allErr = error.details.map((el) => el.message).join(","); //For Additional Details..
    throw new ExpressError(400, allErr);
  } else {
    next();
  }
};

module.exports.reviewValidation = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let allErr = error.details.map((el) => el.message).join(","); //For Additional Details..
    throw new ExpressError(400, allErr);
  } else {
    next();
  }
};
