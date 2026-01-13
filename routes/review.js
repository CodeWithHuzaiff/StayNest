const express=require("express");
const router=express.Router({mergeParams:true});//
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const {reviewValidation,isLoggedIn,isReviewAuthor } = require("../middleware.js");



//Review route
//it has only post req, No get req because review is accessed with the listings not individually.

router.post("/",isLoggedIn,reviewValidation,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id)
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;  //associated author for review!!
    listing.reviews.push(newReview);
  
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Added") //flash msg
    res.redirect(`/listings/${listing._id}`);
  
  }));
  
  //Delete Review
  router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted") //flash msg
    res.redirect(`/listings/${id}`);
  }))

  module.exports = router;