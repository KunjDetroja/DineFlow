const Joi = require("joi");
const {
  CUSTOMER,
  MANAGER,
  WAITER,
  OWNER,
  CHEF,
} = require("../utils/constant");

const loginUserSchema = Joi.object({
  email: Joi.string().trim().required().email().messages({
    "string.email": "Email must be a valid email address.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().trim().required().messages({
    "string.empty": "Password is required.",
    "any.required": "Password is required.",
  }),
});

const createUserSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Name is required.",
    "any.required": "Name is required.",
  }),
  email: Joi.string().trim().required().email().messages({
    "string.email": "Email must be a valid email address.",
    "any.required": "Email is required.",
  }),
  phone: Joi.string().trim().required().messages({
    "string.empty": "Phone number is required.",
    "any.required": "Phone number is required.",
  }),
  password: Joi.string().trim().required().messages({
    "string.empty": "Password is required.",
    "any.required": "Password is required.",
  }),
  role: Joi.string()
    .valid(CUSTOMER, MANAGER, WAITER, OWNER, CHEF)
    .required()
    .messages({
      "any.only":
        "Role must be one of the following: CUSTOMER, MANAGER, WAITER, OWNER, CHEF.",
      "string.empty": "Role is required.",
    }),
  outletId: Joi.string().optional().messages({
    "string.empty": "Outlet ID is required.",
  }),
  restaurantId: Joi.string().messages({
    "string.empty": "Restaurant ID is required.",
  }),
});

const updateUserSchema = Joi.object({
  name: Joi.string().trim().optional().messages({
    "string.empty": "Name cannot be empty.",
  }),
  email: Joi.string().trim().optional().email().messages({
    "string.email": "Email must be a valid email address.",
  }),
  phone: Joi.string().trim().optional().messages({
    "string.empty": "Phone number cannot be empty.",
  }),
  role: Joi.string()
    .valid(CUSTOMER, MANAGER, WAITER, OWNER, CHEF)
    .optional()
    .messages({
      "any.only":
        "Role must be one of the following: CUSTOMER, MANAGER, WAITER, OWNER, CHEF.",
    }),
  outletId: Joi.string().optional().allow(null).messages({
    "string.empty": "Outlet ID cannot be empty.",
  }),
  restaurantId: Joi.string().optional().messages({
    "string.empty": "Restaurant ID cannot be empty.",
  }),
  isActive: Joi.boolean().optional(),
});

module.exports = {
  loginUserSchema,
  createUserSchema,
  updateUserSchema,
};
