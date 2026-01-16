const Listing = require("../models/listing.js");
//setup the Geocoding
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// INDEX
module.exports.index = async (req, res, next) => {
  const listings = await Listing.find();
  res.render("index.ejs", { listings });
};

// NEW
module.exports.renderNewForm = (req, res) => {
  res.render("new.ejs");
};

// CREATE
module.exports.createListing = async (req, res) => {
  let responce=await geocodingClient.forwardGeocode({ //forwardGeocode (query to coordinates)
    query: req.body.listing.location,
    limit: 1 //by default 5 coordinates
  })
    .send()

  let url=req.file.path;
  let filename=req.file.filename;
  const { title, description, price, location, country } =
    req.body.listing;
  const data = new Listing({
    title,
    description,
    image: {
      filename,
      url,
    },
    price,
    location,
    country,
  });
  data.author = req.user._id;
  data.geometry = responce.body.features[0].geometry;
  let SL=await data.save();
  console.log(SL);
  
  req.flash("success", "Listing Created Successfully!!"); //flash msg
  res.redirect("/listings");
};

//Show
module.exports.showListing = async (req, res, next) => {
  const { id } = req.params;
  const attach = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!attach) {
    //attach is an individual listing
    req.flash("error", "Listing Not Found");
    return res.redirect("/listings");
  }

  res.render("show.ejs", { attach });
};

//Edit
module.exports.editListing = async (req, res, next) => {
  const { id } = req.params;
  const target = await Listing.findById(id);
  if (!target) {
    //target is an individual listing
    req.flash("error", "Listing Not Found");
    return res.redirect("/listings");
  }

  let originalImageUrl=target.image.url;
  originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250")

  res.render("edit.ejs", { target ,originalImageUrl});
};


//update
module.exports.updateListing = async (req, res) => {
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

  let listing=await Listing.findByIdAndUpdate(id, updateData, {
    runValidators: true,
    new: true,
  });

  if(typeof req.file !== "undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
  
    listing.image={url,filename};
  
    await listing.save()
  }


  req.flash("success", "Listing Updated Successfully!!"); //flash msg
  res.redirect(`/listings/${id}`);
};

//Delete
module.exports.deleteListing =async (req, res, next) => {
    const { id } = req.params;
    let delList = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully!"); //flash msg
    res.redirect("/listings");
  }