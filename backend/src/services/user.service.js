const User = require("../models/user.model");
const { loginSchema } = require("../validators/user.validator");
const jwt = require("jsonwebtoken");

const loginUser = async (data) => {
  try {
    console.log("Login data:", data);
    const { error } = loginSchema.validate(data);
    console.log("Validation error:", error);
    if (error) {
      return {
        status: 400,
        message: error.details[0].message,
        success: false,
      };
    }

    const { email, password } = data;
    const user = await User.findOne({ email });
    if (!user) {
      return {
        status: 401,
        message: "Invalid email or password",
        success: false,
      };
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return {
        status: 401,
        message: "Invalid email or password",
        success: false,
      };
    }
    const payload = {
      user: {
        id: user._id,
      },
    };
    const tokenExpires = "8d";
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: tokenExpires,
    });

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token,
    };
    return {
      status: 200,
      message: "User logged in successfully",
      success: true,
      data: userData,
    };
  } catch (error) {
    console.error("Error logging in user:", error);
    return {
      status: 500,
      message: "Internal server error",
      success: false,
    };
  }
};

module.exports = {
  loginUser,
};
