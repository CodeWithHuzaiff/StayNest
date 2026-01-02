const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

//Routers
const listingRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const profileRouter=require("./routes/profile.js");
const userRouter=require("./routes/user.js");

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
  secret:"mysecretcode(demo)",
  resave:false,
  saveUninitialized:true,//if true prevent empty sessions to save 
  cookie:{
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly:true,
  },
}

app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


//middleware for flash!
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  next();
})

app.get("/demouser",async (req,res)=>{
  let fakeUser=new User({
    email:"huzaif@gmail.com",
    username:"huzaif123",
  })
  let regUser= await User.register(fakeUser,"hellohuzaif");
  res.send(regUser)
  
})


//Routings
app.use("/listings",listingRouter);
app.use("/listings/:id/review",reviewsRouter);
app.use("/profile",profileRouter);
app.use("/",userRouter);




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
