const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string().trim().required().email().messages({
    "string.email": "Email must be a valid email address.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().trim().required().messages({
    "string.empty": "Password is required.",
    "any.required": "Password is required.",
  }),
});

module.exports = {
  loginSchema,
};
