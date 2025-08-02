const outletService = require("../services/outlet.service");
const {
  errorResponse,
  successResponse,
  catchResponse,
} = require("../utils/response");

const createOutlet = async (req, res) => {
  try {
    const response = await outletService.createOutlet(req.body, req.user);
    if (!response.success) {
      console.log("Error:", response);
      return errorResponse(res, response.status, response.message);
    }
    return successResponse(
      res,
      response.data,
      response.message,
      response.status
    );
  } catch (error) {
    console.error("Error creating outlet:", error);
    return catchResponse(res);
  }
};

const getAllOutlets = async (req, res) => {
  try {
    const response = await outletService.getAllOutlets(req.query, req.user);
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
    console.error("Error fetching outlets:", error);
    return catchResponse(res);
  }
};

const getOutletById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await outletService.getOutletById(id, req.user);
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
    console.error("Error fetching outlet:", error);
    return catchResponse(res);
  }
};

const updateOutlet = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await outletService.updateOutlet(id, req.body, req.user);
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
    console.error("Error updating outlet:", error);
    return catchResponse(res);
  }
};

const deleteOutlet = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await outletService.deleteOutlet(id, req.user);
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
    console.error("Error deleting outlet:", error);
    return catchResponse(res);
  }
};

module.exports = {
  createOutlet,
  getAllOutlets,
  getOutletById,
  updateOutlet,
  deleteOutlet,
};