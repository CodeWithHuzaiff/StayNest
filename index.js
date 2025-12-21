const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const Listing = require("./models/listing.js");

const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")))
app.engine("ejs",ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
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

// TEST
// app.get("/testListing", async (req, res) => {
//   const sampleListing = new Listing({
//     title: "My new villa",
//     description: "By the river stream!",
//     price: 1900,
//     location: "Kerala",
//     country: "India",
//   });

//   await sampleListing.save();
//   res.send("Test listing saved");
// });

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
  const { title, description,image, price, location, country } = req.body;
  const data = new Listing({ title, description,image,price, location, country });
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
    let { id } = req.params;
    const { title, description,imageUrl, price, location, country } = req.body;

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
      id,updateData,{ runValidators: true }
    );

    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Update failed");
  }
});


// DELETE
app.delete("/listings/:id", async (req, res) =>{
    const { id } = req.params;
    let delList=await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})




app.listen(8080, () => {
  console.log("Server running on port 8080");
});