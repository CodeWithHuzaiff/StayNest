const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const Listing = require("./models/listing.js");
const Profile = require("./models/profile.js");
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");
const {listingSchema} = require("./schema.js");
const { error } = require("console");

const app = express();

app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));

const mongo_url = "mongodb://127.0.0.1:27017/StayNest";

async function main() {
  await mongoose.connect(mongo_url);
  console.log("Connected to DB");
}
main().catch(console.error);

//For schema Validation...
const listingValidation=(req,res,next)=>{
  let {error}=listingSchema.validate(req.body);
  if(error){
    let allErr=error.details.map((el)=>el.message).join(",") //For Additional Details..
    throw new ExpressError(400,allErr);
  }else{
    next();
  }
}


// HOME
app.get("/", (req, res) => {
  res.send("Connected");
});

// INDEX
app.get("/listings",wrapAsync( async (req, res, next) => {
    const listings = await Listing.find();
    res.render("index.ejs", { listings });

}));

// NEW
app.get("/listings/new", (req, res) => {
  res.render("new.ejs");
});

// CREATE
app.post("/listings",listingValidation,wrapAsync(async (req, res,next) => {
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

}));

// SHOW
app.get("/listings/:id",wrapAsync(async (req, res,next) => {
    const { id } = req.params;
    const attach = await Listing.findById(id);
    if (!attach) {
      return next(new ExpressError(404,"Listing not found"));
    }
    res.render("show.ejs", { attach });

}));

// EDIT
app.get("/listings/:id/edit",wrapAsync(async (req, res,next) => {
    const { id } = req.params;
    const target = await Listing.findById(id);
    res.render("edit.ejs", { target });
}));

// UPDATE
app.put(
  "/listings/:id",
  listingValidation,
  wrapAsync(async (req, res) => {
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

    await Listing.findByIdAndUpdate(id, updateData, {
      runValidators: true,
      new: true,
    });

    res.redirect(`/listings/${id}`);
  })
);

// DELETE
app.delete("/listings/:id",wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    let delList = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");

}));



//---------Another DATABASE-------

//contacts route
app.get("/contacts",wrapAsync(async (req, res) => {
  const user = await Profile.findOne();
  res.render("contacts.ejs",{user});
}));

//profile route
app.get("/profile", wrapAsync(async (req, res, next) => {
    const user = await Profile.findOne();
    if (!user) {
      return next(new ExpressError(404,"User not found"));
    }
    res.render("profile.ejs", { user });

}));

//Edit profile route
app.get("/profile/edit/:id",wrapAsync( async (req, res) => {
  const { id } = req.params;
  user = await Profile.findById(id);
  res.render("profileEdit.ejs", { user });
}));

app.put("/profile",wrapAsync(async (req, res) => {
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
}));


app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

//Global error handler

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
