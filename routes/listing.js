const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const {isLoggedIn} = require("../middleware.js");

const listingValidation=(req,res,next)=>{
  let {error}=listingSchema.validate(req.body);
  if(error){
    let allErr=error.details.map((el)=>el.message).join(",") //For Additional Details..
    throw new ExpressError(400,allErr);
  }else{
    next();
  }
}

// INDEX
router.get("/",wrapAsync( async (req, res, next) => {
    const listings = await Listing.find();
    res.render("index.ejs", { listings });

}));

// NEW
router.get("/new",isLoggedIn, (req, res) => {
  res.render("new.ejs");
});

// CREATE
router.post("/",isLoggedIn,listingValidation,wrapAsync(async (req, res) => {
    const { title, description, imageUrl, price, location, country } = req.body.listing;
    const data = new Listing({
      title,
      description,
      image: {
        filename: "listingimage",
        url: imageUrl,
      },
      price,
      location,
      country,
    });
    await data.save();
    req.flash("success","Listing Created Successfully!!") //flash msg
    res.redirect("/listings");

}));

// SHOW
router.get("/:id",wrapAsync(async (req, res,next) => {
    const { id } = req.params;
    const attach = await Listing.findById(id).populate("reviews");
    if (!attach) { //attach is an individual listing
      req.flash("error","Listing Not Found");
      return res.redirect("/listings");
    }
    res.render("show.ejs", { attach });

}));

// EDIT
router.get("/:id/edit",isLoggedIn,wrapAsync(async (req, res,next) => {
    const { id } = req.params;
    const target = await Listing.findById(id);
    if (!target) { //target is an individual listing
      req.flash("error","Listing Not Found");
      return res.redirect("/listings");
    }
    res.render("edit.ejs", { target });
}));

// UPDATE
router.put(
  "/:id",
  isLoggedIn,
  listingValidation,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { title, description, imageUrl, price, location, country } =req.body.listing;
    const updateData = {
      title,
      description,
      price,
      location,
      country,
    };

    if (imageUrl && imageUrl.trim() !== "") {
      updateData.image = {
        filename: "listingimage",
        url: imageUrl,
      };
    }

    await Listing.findByIdAndUpdate(id, updateData, {
      runValidators: true,
      new: true,
    });
    req.flash("success","Listing Updated Successfully!!") //flash msg
    res.redirect(`/listings/${id}`);
  })
);

// DELETE
router.delete("/:id",isLoggedIn,wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    let delList = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Successfully!") //flash msg
    res.redirect("/listings");

}));

module.exports = router;