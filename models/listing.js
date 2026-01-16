const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const { required } = require("joi");


const listSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: String,

  image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      default:
        "https://scw-mag.com/wp-content/uploads/sites/7/2023/10/Housing-supply-chain-problem-image-1-800x445.jpeg",
    },
  },

  price: Number,
  location: String,
  country: String,
  reviews:[
    {
      type: Schema.Types.ObjectId,
      ref:"Review",
    }
  ],
  author:{
    type: Schema.Types.ObjectId,
    ref:"User",
  },
  //geoJSON
  geometry:{
    type:{
      type:String,
      enum:['Point'],
      required:true,
    },
    coordinates:{
      type:[Number],
      required:true,
    }
  }
});

listSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}})
  }
});

const Listing = mongoose.model("Listing", listSchema);
module.exports = Listing;