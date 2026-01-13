const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {listingValidation , isLoggedIn, isAuthor } = require("../middleware.js");



// INDEX
router.get(
  "/",
  wrapAsync(async (req, res, next) => {
    const listings = await Listing.find();
    res.render("index.ejs", { listings });
  })
);

// NEW
router.get("/new", isLoggedIn, (req, res) => {
  res.render("new.ejs");
});

// CREATE
router.post(
  "/",
  isLoggedIn,
  listingValidation,
  wrapAsync(async (req, res) => {
    const { title, description, imageUrl, price, location, country } =
      req.body.listing;
    // const data=new Listing(req.body.listing);
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
    data.author = req.user._id;
    await data.save();
    req.flash("success", "Listing Created Successfully!!"); //flash msg
    res.redirect("/listings");
  })
);

// SHOW
router.get(
  "/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const attach = await Listing.findById(id)
      .populate({
        path:"reviews",
        populate:{
          path:"author",
        }
      })
      .populate("author");
    if (!attach) {
      //attach is an individual listing
      req.flash("error", "Listing Not Found");
      return res.redirect("/listings");
    }

    res.render("show.ejs", { attach });
  })
);

// EDIT
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const target = await Listing.findById(id);
    if (!target) {
      //target is an individual listing
      req.flash("error", "Listing Not Found");
      return res.redirect("/listings");
    }
    res.render("edit.ejs", { target });
  })
);

// UPDATE
router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  listingValidation,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { title, description, imageUrl, price, location, country } =
      req.body.listing;
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
    req.flash("success", "Listing Updated Successfully!!"); //flash msg
    res.redirect(`/listings/${id}`);
  })
);

// DELETE
router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    let delList = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully!"); //flash msg
    res.redirect("/listings");
  })
);

module.exports = router;
