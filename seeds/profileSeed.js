const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const Profile = require("../models/profile");

async function seedProfile() {
  await mongoose.connect(process.env.ATLASDB_URL);
  console.log("Connected to DB");

  await Profile.deleteMany({}); // optional, clears old

  await Profile.create({
    name: "Mohammad Huzaif",
    role: "Full-Stack Web Developer",
    email: "mohammadhuzaiff@gmail.com",
    phone: "7006935455",
    note: "Open to learning opportunities and collaborations."
  });

  console.log("Profile inserted");
  mongoose.connection.close();
}

seedProfile();