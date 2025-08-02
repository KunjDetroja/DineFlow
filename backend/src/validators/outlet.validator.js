const Joi = require("joi");

const createOutletSchema = Joi.object({
  restaurantId: Joi.string().optional().messages({
    "string.empty": "Restaurant ID cannot be empty.",
  }),
  name: Joi.string().trim().required().messages({
    "string.empty": "Outlet name is required.",
    "any.required": "Outlet name is required.",
  }),
  address: Joi.string().trim().required().messages({
    "string.empty": "Address is required.",
    "any.required": "Address is required.",
  }),
  city: Joi.string().trim().required().messages({
    "string.empty": "City is required.",
    "any.required": "City is required.",
  }),
  state: Joi.string().trim().required().messages({
    "string.empty": "State is required.",
    "any.required": "State is required.",
  }),
  country: Joi.string().trim().required().messages({
    "string.empty": "Country is required.",
    "any.required": "Country is required.",
  }),
  pincode: Joi.string().trim().required().messages({
    "string.empty": "Pincode is required.",
    "any.required": "Pincode is required.",
  }),
  phone: Joi.string().trim().optional().messages({
    "string.empty": "Phone number cannot be empty.",
  }),
});

const updateOutletSchema = Joi.object({
  name: Joi.string().trim().optional().messages({
    "string.empty": "Outlet name cannot be empty.",
  }),
  address: Joi.string().trim().optional().messages({
    "string.empty": "Address cannot be empty.",
  }),
  city: Joi.string().trim().optional().messages({
    "string.empty": "City cannot be empty.",
  }),
  state: Joi.string().trim().optional().messages({
    "string.empty": "State cannot be empty.",
  }),
  country: Joi.string().trim().optional().messages({
    "string.empty": "Country cannot be empty.",
  }),
  pincode: Joi.string().trim().optional().messages({
    "string.empty": "Pincode cannot be empty.",
  }),
  phone: Joi.string().trim().optional().allow("").messages({
    "string.empty": "Phone number cannot be empty.",
  }),
  isActive: Joi.boolean().optional().messages({
    "boolean.base": "Active status must be true or false.",
  }),
});

module.exports = {
  createOutletSchema,
  updateOutletSchema,
};