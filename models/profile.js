const mongoose = require("mongoose");

let profileSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    phone:String,
    location:String,
})


const Profile=new mongoose.model("profile",profileSchema);
module.exports = Profile;

