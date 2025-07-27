const restaurantService = require("../services/restaurant.service");
const {
  errorResponse,
  successResponse,
  catchResponse,
} = require("../utils/response");
const mongoose = require("mongoose");

const createRestaurant = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const response = await restaurantService.createRestaurant(req.body,session);
    if (!response.success) {
      console.log("Error:", response);
      await session.abortTransaction();
      return errorResponse(res, response.status, response.message);
    }
    await session.commitTransaction();
    return successResponse(
      res,
      response.data,
      response.message,
      response.status
    );
  } catch (error) {
    await session.abortTransaction();
    console.error("Error creating restaurant:", error);
    return catchResponse(res);
  } finally {
    session.endSession();
  }
};

const getAllRestaurants = async (req, res) => {
  try {
    const response = await restaurantService.getAllRestaurants(req.query);
    if (!response.success) {
      return errorResponse(res, response.status, response.message);
    }
    return successResponse(
      res,
      response.data,
      response.message,
      response.status
    );
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return catchResponse(res);
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await restaurantService.getRestaurantById(id);
    if (!response.success) {
      return errorResponse(res, response.status, response.message);
    }
    return successResponse(
      res,
      response.data,
      response.message,
      response.status
    );
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return catchResponse(res);
  }
};

const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await restaurantService.updateRestaurant(id, req.body);
    if (!response.success) {
      return errorResponse(res, response.status, response.message);
    }
    return successResponse(
      res,
      response.data,
      response.message,
      response.status
    );
  } catch (error) {
    console.error("Error updating restaurant:", error);
    return catchResponse(res);
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await restaurantService.deleteRestaurant(id);
    if (!response.success) {
      return errorResponse(res, response.status, response.message);
    }
    return successResponse(
      res,
      null,
      response.message,
      response.status
    );
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    return catchResponse(res);
  }
};

module.exports = {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
};
