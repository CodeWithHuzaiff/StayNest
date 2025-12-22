const mongoose=require("mongoose");
const mongo_url='mongodb://127.0.0.1:27017/StayNest'

const initData=require("./data.js");
const initUser=require("./setupProfile.js");

const Listing=require('../models/listing.js');
const Profile=require('../models/profile.js');


async function main() {
    await mongoose.connect(mongo_url);
}

const initDB= async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);

    const existingProfile=await Profile.findOne();
    if(!existingProfile){
        await Profile.insertOne(initUser.user);
    }else{
        console.log("profile already exists");
        
    }
    console.log("Data was initialised");
    
}

main().then(()=>{
    initDB();
    console.log("conected to DB");
    
}).catch((err)=>{
    console.log(err);
    mongoose.connection.close();
})

