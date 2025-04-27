const { catchResponse, errorResponse, successResponse } = require("../utils/response");
const inquiryService = require("../services/inquiry.service");

const createInquiry = async (req, res) => {
  try {
    const response = await inquiryService.createInquiry(req.body);
    if (!response.success) {
      console.log("Error:", response);
      return errorResponse(res, response.status, response.message);
    }
    return successResponse(res, response.data, response.message, response.status);
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return catchResponse(res);
  }
};

const getAllInquiries = async (req, res) => {
  try {
    const response = await inquiryService.getAllInquiries(req.query);
    if (!response.success) {
      console.log("Error:", response);
      return errorResponse(res, response.status, response.message);
    }
    return successResponse(res, response.data, response.message, response.status);
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return catchResponse(res);
  }
}

module.exports = {
  createInquiry,
  getAllInquiries,
};
