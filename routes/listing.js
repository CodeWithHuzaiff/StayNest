const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingValidation, isLoggedIn, isAuthor } = require("../middleware.js");
const listingController = require("../controllers/listing.js");

// INDEX & CREATE
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    listingValidation,
    wrapAsync(listingController.createListing)
  );

// NEW,UPDATE & DELETE
router.get("/new", isLoggedIn, listingController.renderNewForm);

// SHOW
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isAuthor,
    listingValidation,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isAuthor, wrapAsync(listingController.deleteListing));

// EDIT
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  wrapAsync(listingController.editListing)
);

module.exports = router;
