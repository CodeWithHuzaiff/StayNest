require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const { data: sampleListings } = require("../init/data.js");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocoder = mbxGeocoding({ accessToken: process.env.MAP_TOKEN });

const dbUrl=process.env.ATLASDB_URL

mongoose.connect(dbUrl)
  .then(() => console.log("Mongo connected"))
  .catch(err => console.log(err));

async function seedDB() {
  await Listing.deleteMany({});
  console.log("Old listings removed");

  for (let listing of sampleListings) {
    try {
      const geoData = await geocoder.forwardGeocode({
        query: `${listing.location}, ${listing.country}`,
        limit: 1
      }).send();

      if (!geoData.body.features.length) {
        console.log("No geocode result for:", listing.location);
        continue;
      }

      const geometry = geoData.body.features[0].geometry;

      const newListing = new Listing({
        ...listing,
        geometry
      });

      await newListing.save();
      console.log("Saved:", listing.location);
    } catch (err) {
      console.error("Error with:", listing.location, err.message);
    }
  }

  mongoose.connection.close();
  console.log("Seeding complete");
}

seedDB();