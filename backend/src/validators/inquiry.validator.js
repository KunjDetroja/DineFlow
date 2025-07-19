const Joi = require("joi");

const createInquirySchema = Joi.object({
  restaurantName: Joi.string().trim().required().messages({
    "string.base": "Restaurant name must be a string.",
    "string.empty": "Restaurant name is required.",
  }),

  numberOfOutlets: Joi.number().integer().optional().messages({
    "number.base": "Number of outlets must be a number.",
  }),

  email: Joi.string().email().trim().required().messages({
    "string.email": "Email must be a valid email address.",
    "any.required": "Email is required.",
  }),

  phone: Joi.string()
    .pattern(/^[0-9]{7,15}$/) // allows phone numbers between 7 to 15 digits
    .required()
    .messages({
      "string.pattern.base":
        "Phone must be a valid number with 7 to 15 digits.",
      "any.required": "Phone number is required.",
    }),

  name: Joi.string().trim().required().messages({
    "string.base": "Name must be a string.",
    "string.empty": "Name is required.",
  }),

  description: Joi.string().trim().messages({
    "string.base": "Description must be a string.",
  }),
});

module.exports = { createInquirySchema };
