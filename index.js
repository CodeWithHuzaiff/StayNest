const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");
const listing=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const profile=require("./routes/profile.js");
const session=require("express-session");

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


const sessionOptions={
  secret:"mysecrectcode(demo)",
  resave:false,
  saveUninitialized:true,
}

app.use(session(sessionOptions));


//Routings
app.use("/listings",listing);
app.use("/listings/:id/review",reviews);
app.use("/profile",profile);




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
