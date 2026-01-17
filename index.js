if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const session=require("express-session");
const MongoStore = require("connect-mongo").default;
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

const dbUrl=process.env.ATLASDB_URL

const PORT = 8080;

async function startServer() {
  try {
    await mongoose.connect(dbUrl);
    console.log("MongoDB Atlas connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
}

startServer();

const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,//seconds
})
store.on("error",()=>{
  console.log("Error in mongo store",err);
  
})


const sessionOptions={
  store,
  secret:process.env.SECRET,
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


//middleware accessed locally!
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currentUser=req.user;
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

app.get("/", (req, res) => {
  res.redirect("/listings");
});



app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});


//Global error handler

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("error.ejs", { message });
});

