const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const {reviewValidation,isLoggedIn,isReviewAuthor,} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

//Review route
//it has only post req, No get req because review is accessed with the listings not individually.

//post
router.post("/",isLoggedIn,reviewValidation,wrapAsync(reviewController.postReview));

//Delete Review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;
