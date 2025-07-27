const {
  createRestaurantSchema,
} = require("../validators/restaurant.validator");
const Restaurant = require("../models/restaurant.model");
const userService = require("./user.service");
const { OWNER } = require("../utils/constant");
const { generatePassword } = require("../utils");

const createRestaurant = async (data, session) => {
  try {
    if (!data.restaurant) {
      return {
        status: 400,
        message: "Restaurant data is required",
        success: false,
      };
    }
    if (!data.user) {
      return {
        status: 400,
        message: "User data is required",
        success: false,
      };
    }
    const { error } = createRestaurantSchema.validate(data.restaurant);
    if (error) {
      return {
        status: 400,
        message: error.details[0].message,
        success: false,
      };
    }
    const restaurant = new Restaurant(data.restaurant);
    const newRestaurant = await restaurant.save({ session });
    const password = generatePassword(8);
    console.log("Email:", data.user.email, ", Password:", password)
    const userData = {
      ...data.user,
      password: password,
      restaurantId: newRestaurant._id.toString(),
      role: OWNER,
    };
    const user = await userService.createUser(userData, session);
    if (!user.success) {
      return {
        status: user.status,
        message: user.message,
        success: false,
      };
    }
    return {
      status: 201,
      message: "Restaurant and owner created successfully",
      success: true,
      data: {
        restaurant: newRestaurant,
        user: user.data,
      },
    };
  } catch (error) {
    console.error("Error creating restaurant:", error);
    return {
      status: 500,
      message: "Internal server error",
      success: false,
    };
  }
};

module.exports = {
  createRestaurant,
};
