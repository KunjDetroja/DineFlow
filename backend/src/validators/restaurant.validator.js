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

const updateRestaurantSchema = Joi.object({
  name: Joi.string().trim().optional().messages({
    "string.empty": "Name cannot be empty.",
  }),
  logo: Joi.string().optional().allow("").messages({
    "string.empty": "Logo URL cannot be empty.",
  }),
  isActive: Joi.boolean().optional().messages({
    "boolean.base": "Active status must be true or false.",
  }),
});

module.exports = {
  createRestaurantSchema,
  updateRestaurantSchema,
};
