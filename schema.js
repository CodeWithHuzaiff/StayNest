const joi=require("joi");

const listingSchema=joi.object({
    Listing:joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        image:joi.string().allow(""),
        price:joi.number().required().min(0),
        location:joi.string().required(),
        country:joi.string().required(),
    }).required(),
    
});
module.exports=listingSchema;