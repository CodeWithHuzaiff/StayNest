const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.postReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id)
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;  //associated author for review!!
    listing.reviews.push(newReview);
  
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Added") //flash msg
    res.redirect(`/listings/${listing._id}`);
  
  }

  module.exports.deleteReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted") //flash msg
    res.redirect(`/listings/${id}`);
  }