const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const Listing = require("./models/listing.js");
const Profile = require("./models/profile.js");

const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));

const mongo_url = "mongodb://127.0.0.1:27017/StayNest";

async function main() {
  await mongoose.connect(mongo_url);
  console.log("Connected to DB");
}
main().catch(console.error);

// HOME
app.get("/", (req, res) => {
  res.send("Connected");
});

// INDEX
app.get("/listings", async (req, res) => {
  const listings = await Listing.find();
  res.render("index.ejs", { listings });
});

// NEW
app.get("/listings/new", (req, res) => {
  res.render("new.ejs");
});

// CREATE
app.post("/listings", async (req, res) => {
  const { title, description, image, price, location, country } = req.body;
  const data = new Listing({
    title,
    description,
    image,
    price,
    location,
    country,
  });
  await data.save();
  res.redirect("/listings");
});

// SHOW
app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const attach = await Listing.findById(id);
  res.render("show.ejs", { attach });
});

// EDIT
app.get("/listings/:id/edit", async (req, res) => {
  const { id } = req.params;
  const target = await Listing.findById(id);
  res.render("edit.ejs", { target });
});

// UPDATE
app.put("/listings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, imageUrl, price, location, country } = req.body;

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
    await Listing.findByIdAndUpdate(
      id,
      { $set: updateData },
      { runValidators: true, new: true }
    );

    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Update failed");
  }
});

// DELETE
app.delete("/listings/:id", async (req, res) => {
  const { id } = req.params;
  let delList = await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

//contacts route
app.get("/contacts", (req, res) => {
  res.render("contacts.ejs");
});

//profile route
app.get("/profile", async (req, res) => {
  const user = await Profile.findOne();
  if (!user) {
    return res.send("User not found!");
  }
  res.render("profile.ejs", { user });
});

//Edit profile route
app.get("/profile/edit/:id", async (req, res) => {
  const { id } = req.params;
  user = await Profile.findById(id);
  res.render("profileEdit.ejs", { user });
});
app.put("/profile", async (req, res) => {
  const user = await Profile.findOne();

  const { name, email, phone, location, password } = req.body;
  const updateUser = {
    name,
    email,
    phone,
    location,
    password,
  };

  if (user.password != password) {
    res.send("Incorrect Password!!");
  }
  user.name = name;
  user.phone = phone;
  user.location = location;

  await user.save();
  res.redirect("/profile");
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
