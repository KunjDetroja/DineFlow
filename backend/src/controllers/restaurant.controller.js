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

module.exports = {
  createRestaurant,
};
