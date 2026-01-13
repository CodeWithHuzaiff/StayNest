const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingValidation, isLoggedIn, isAuthor } = require("../middleware.js");
const listingController = require("../controllers/listing.js");

// INDEX
router.get("/", wrapAsync(listingController.index));

// NEW
router.get("/new", isLoggedIn, listingController.renderNewForm);

// CREATE
router.post("/",isLoggedIn,listingValidation,wrapAsync(listingController.createListing));

// SHOW
router.get("/:id", wrapAsync(listingController.showListing));

// EDIT
router.get("/:id/edit",isLoggedIn,isAuthor,wrapAsync(listingController.editListing));

// UPDATE
router.put("/:id",isLoggedIn,isAuthor,listingValidation,wrapAsync(listingController.updateListing));

// DELETE
router.delete("/:id",isLoggedIn,isAuthor,wrapAsync(listingController.deleteListing));

module.exports = router;
