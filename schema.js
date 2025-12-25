const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    imageUrl: Joi.string().allow("", null),
    price: Joi.number().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
});