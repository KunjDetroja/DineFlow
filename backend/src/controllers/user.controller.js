const userService = require("../services/user.service");
const { errorResponse, successResponse } = require("../utils/response");

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
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      success: false,
    });
  }
};

module.exports = {
  loginUser,
};
