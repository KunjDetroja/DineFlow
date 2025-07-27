const {
  createRestaurantSchema,
  updateRestaurantSchema,
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
    const { page = 1, limit = 10, search = "", status = "" } = req_query;
    const pageNumber = Number.isInteger(parseInt(page, 10))
      ? parseInt(page, 10)
      : 1;
    const limitNumber = Number.isInteger(parseInt(limit, 10))
      ? parseInt(limit, 10)
      : 10;
    const skip = (pageNumber - 1) * limitNumber;

    // Build search query - exclude soft deleted restaurants
    const searchQuery = { isDeleted: false };
    if (search && search.trim() !== "") {
      searchQuery.name = { $regex: search.trim(), $options: "i" };
    }
    if (status && status.trim() !== "") {
      searchQuery.isActive = status.trim() === "true" ? true : false;
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

const getRestaurantById = async (id) => {
  try {
    if (!id) {
      return {
        status: 400,
        message: "Restaurant ID is required",
        success: false,
      };
    }

    const restaurant = await Restaurant.findOne({ _id: id, isDeleted: false });

    if (!restaurant) {
      return {
        status: 404,
        message: "Restaurant not found",
        success: false,
      };
    }

    return {
      status: 200,
      message: "Restaurant fetched successfully",
      success: true,
      data: restaurant,
    };
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return {
      status: 500,
      message: "Internal server error",
      success: false,
    };
  }
};

const updateRestaurant = async (id, data) => {
  try {
    if (!id) {
      return {
        status: 400,
        message: "Restaurant ID is required",
        success: false,
      };
    }

    const { error } = updateRestaurantSchema.validate(data);
    if (error) {
      return {
        status: 400,
        message: error.details[0].message,
        success: false,
      };
    }

    const restaurant = await Restaurant.findOne({ _id: id, isDeleted: false });

    if (!restaurant) {
      return {
        status: 404,
        message: "Restaurant not found",
        success: false,
      };
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      { ...data },
      { new: true, runValidators: true }
    );

    return {
      status: 200,
      message: "Restaurant updated successfully",
      success: true,
      data: updatedRestaurant,
    };
  } catch (error) {
    console.error("Error updating restaurant:", error);
    return {
      status: 500,
      message: "Internal server error",
      success: false,
    };
  }
};

const deleteRestaurant = async (id) => {
  try {
    if (!id) {
      return {
        status: 400,
        message: "Restaurant ID is required",
        success: false,
      };
    }

    const restaurant = await Restaurant.findOne({ _id: id, isDeleted: false });

    if (!restaurant) {
      return {
        status: 404,
        message: "Restaurant not found",
        success: false,
      };
    }

    // Soft delete
    await Restaurant.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    return {
      status: 200,
      message: "Restaurant deleted successfully",
      success: true,
    };
  } catch (error) {
    console.error("Error deleting restaurant:", error);
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
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
};
