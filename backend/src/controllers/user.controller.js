const userService = require("../services/user.service");
const {
  errorResponse,
  successResponse,
  catchResponse,
} = require("../utils/response");

const loginUser = async (req, res) => {
  try {
    const response = await userService.loginUser(req.body);
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
    console.error("Error logging in user:", error);
    return catchResponse(res);
  }
};
const getCurrentUser = async (req, res, next) => {
  try {
    const response = await userService.getCurrentUser(req.user._id);
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
    console.error("Error logging in user:", error);
    return catchResponse(res);
  }
};

module.exports = {
  loginUser,
  getCurrentUser,
};
