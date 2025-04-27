const Joi = require("joi");

const createRestaurantSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Name is required.",
    "any.required": "Name is required.",
  }),
  logo: Joi.string().optional().messages({
    "string.empty": "Logo URL is required.",
  }),
});

module.exports = {
  createRestaurantSchema,
};
