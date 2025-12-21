const mongoose=require("mongoose");
const mongo_url='mongodb://127.0.0.1:27017/StayNest'

const initData=require("./data.js");
const Listing=require('../models/listing.js');

main().then(()=>{
    console.log("conected to DB");
    
}).catch((err)=>{
    console.log(err);
})


async function main() {
    await mongoose.connect(mongo_url);
}

const initDB= async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data was initialised");
    
}

initDB();