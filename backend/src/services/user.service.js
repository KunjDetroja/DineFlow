const User = require("../models/user.model");
const { CHEF, ORDERTAKER, MANAGER } = require("../utils/constant");
const {
  loginUserSchema,
  createUserSchema,
} = require("../validators/user.validator");
const jwt = require("jsonwebtoken");

const createUser = async (data, session) => {
  try {
    const { error } = createUserSchema.validate(data);
    if (error) {
      return {
        status: 400,
        message: error.details[0].message,
        success: false,
      };
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return {
        status: 400,
        message: "Email already exists",
        success: false,
      };
    }

    const isStaff = [CHEF, ORDERTAKER, MANAGER].includes(data.role);
    const isOwner = data.role === "OWNER";
    if (isStaff && !data.outletId) {
      return {
        status: 400,
        message: "Outlet ID is required",
        success: false,
      };
    }
    if (isStaff && !data.restaurantId) {
      return {
        status: 400,
        message: "Restaurant ID is required",
        success: false,
      };
    }
    if (isOwner && !data.restaurantId) {
      return {
        status: 400,
        message: "Restaurant ID is required for OWNER role",
        success: false,
      };
    }
    const user = new User(data);
    const newUser = await user.save({ session });
    return {
      status: 201,
      message: "User created successfully",
      success: true,
      data: newUser,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      status: 500,
      message: "Internal server error",
      success: false,
    };
  }
};

const loginUser = async (data) => {
  try {
    const { error } = loginUserSchema.validate(data);
    console.log("Validation error:", error);
    if (error) {
      return {
        status: 400,
        message: error.details[0].message,
        success: false,
      };
    }

    const { email, password } = data;
    const user = await User.findOne({ email }).select("+password");
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
      id: user._id,
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

const getCurrentUser = async (userId) => {
  try {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return { success: false, statusCode: 404, message: "User not found" };
    }

    return { success: true, statusCode: 200, data: user };
  } catch (error) {
    console.error("Error getting current user:", error);
    return {
      status: 500,
      message: "Internal server error",
      success: false,
    };
  }
};

module.exports = {
  createUser,
  loginUser,
  getCurrentUser,
};
