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
    console.log("Email:", data.user.email, ", Password:", password);
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

const getAllRestaurants = async (req_query) => {
  try {
    const { page = 1, limit = 10, search = "" } = req_query;
    const pageNumber = Number.isInteger(parseInt(page, 10))
      ? parseInt(page, 10)
      : 1;
    const limitNumber = Number.isInteger(parseInt(limit, 10))
      ? parseInt(limit, 10)
      : 10;
    const skip = (pageNumber - 1) * limitNumber;

    // Build search query
    const searchQuery = {};
    if (search && search.trim() !== "") {
      searchQuery.name = { $regex: search.trim(), $options: "i" };
    }

    const restaurants = await Restaurant.find(searchQuery)
      .skip(skip)
      .limit(limitNumber);
    const totalRestaurants = await Restaurant.countDocuments(searchQuery);

    if (!restaurants || restaurants.length === 0) {
      return {
        status: 404,
        message: search
          ? "No restaurants found matching your search"
          : "No restaurants found",
        success: false,
      };
    }

    const totalPages = Math.ceil(totalRestaurants / limitNumber);
    const pagination = {
      totalItems: totalRestaurants,
      totalPages,
      currentPage: pageNumber,
      limit: limitNumber,
    };

    return {
      status: 200,
      message: search
        ? "Restaurants found matching your search"
        : "Restaurants fetched successfully",
      success: true,
      data: {
        data: restaurants,
        pagination,
      },
    };
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return {
      status: 500,
      message: "Internal server error",
      success: false,
    };
  }
};

module.exports = {
  createRestaurant,
  getAllRestaurants,
};
