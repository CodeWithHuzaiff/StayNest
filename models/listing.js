const mongoose = require("mongoose");

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
});

const Listing = mongoose.model("Listing", listSchema);
module.exports = Listing;