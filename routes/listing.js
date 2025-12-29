const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");

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
router.get("/new", (req, res) => {
  res.render("new.ejs");
});

// CREATE
router.post("/",listingValidation,wrapAsync(async (req, res) => {
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
    res.redirect("/listings");

}));

// SHOW
router.get("/:id",wrapAsync(async (req, res,next) => {
    const { id } = req.params;
    const attach = await Listing.findById(id).populate("reviews");
    if (!attach) {
      return next(new ExpressError(404,"Listing not found"));
    }
    res.render("show.ejs", { attach });

}));

// EDIT
router.get("/:id/edit",wrapAsync(async (req, res,next) => {
    const { id } = req.params;
    const target = await Listing.findById(id);
    res.render("edit.ejs", { target });
}));

// UPDATE
router.put(
  "/:id",
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

    res.redirect(`/listings/${id}`);
  })
);

// DELETE
router.delete("/:id",wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    let delList = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");

}));

module.exports = router;