const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");
// const mongo_url =process.env.ATLASDB_URL;

const initData = require("./data.js");

const Listing = require("../models/listing.js");
const Profile = require("../models/profile.js");

async function main() {
  await mongoose.connect(process.env.ATLASDB_URL);
}

const initDB = async () => {
  const enriched = initData.map((obj) => ({
    ...obj,
    author: new mongoose.Types.ObjectId("696b06681d119d51ed26d0e6"),
  }));

  await Listing.deleteMany({});
  await Listing.insertMany(enriched);

  console.log("Data was initialised");
};
//Eye on it
// const existingProfile = await Profile.findOne();
// if (!existingProfile) {
//   await Profile.create(initUser.user);
// } else {
//   console.log("profile already exists");
// }
// console.log("Data was initialised");

main()
  .then(async () => {
    console.log("connected to DB");
    await initDB();
    mongoose.connection.close();
  })
  .catch((err) => {
    console.log(err);
    mongoose.connection.close();
  });
