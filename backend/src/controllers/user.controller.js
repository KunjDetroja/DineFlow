const userService = require("../services/user.service");
const {
  errorResponse,
  successResponse,
  catchResponse,
} = require("../utils/response");
const mongoose = require("mongoose");

const createUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const response = await userService.createUser(req.body, session,req.user);
    if (!response.success) {
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
    console.error("Error creating user:", error);
    return catchResponse(res);
  } finally {
    session.endSession();
  }
};

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

const getAllUsers = async (req, res) => {
  try {
    const currentUser = req.user;
    const response = await userService.getAllUsers(req.query, currentUser);

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
    console.error("Error fetching users:", error);
    return catchResponse(res);
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;
    const response = await userService.getUserById(id, currentUser);

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
    console.error("Error fetching user:", error);
    return catchResponse(res);
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;
    const response = await userService.updateUser(id, req.body, currentUser);

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
    console.error("Error updating user:", error);
    return catchResponse(res);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;
    const response = await userService.deleteUser(id, currentUser);

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
    console.error("Error deleting user:", error);
    return catchResponse(res);
  }
};

module.exports = {
  createUser,
  loginUser,
  getCurrentUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
