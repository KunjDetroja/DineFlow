const Inquiry = require("../models/inquiry.model");
const { createInquirySchema } = require("../validators/inquiry.validator");
const { createRestaurant } = require("./restaurant.service");

const createInquiry = async (data) => {
  try {
    const { error } = createInquirySchema.validate(data, {
      abortEarly: false,
    });
    if (error) {
      return {
        status: 400,
        message: error.details[0].message,
        success: false,
      };
    }
    const existingInquiry = await Inquiry.findOne({
      email: data.email,
    });
    if (existingInquiry) {
      return {
        status: 400,
        message: "Email already exists",
        success: false,
      };
    }
    const inquiry = new Inquiry(data);
    await inquiry.save();
    return {
      status: 201,
      message: "Inquiry created successfully",
      success: true,
      data: inquiry,
    };
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return {
      status: 500,
      message: "Internal server error",
      success: false,
    };
  }
};

const getAllInquiries = async (req_query) => {
  try {
    const { page = 1, limit = 10 } = req_query;
    const pageNumber = Number.isInteger(parseInt(page, 10))
      ? parseInt(page, 10)
      : 1;
    const limitNumber = Number.isInteger(parseInt(limit, 10))
      ? parseInt(limit, 10)
      : 10;
    const skip = (pageNumber - 1) * limitNumber;
    const totalInquiries = await Inquiry.countDocuments();

    const inquiries = await Inquiry.find().skip(skip).limit(limitNumber);
    if (!inquiries || inquiries.length === 0) {
      return {
        status: 404,
        message: "No inquiries found",
        success: false,
      };
    }
    const totalPages = Math.ceil(totalInquiries / limitNumber);
    const pagination = {
      totalItems: totalInquiries,
      totalPages,
      currentPage: pageNumber,
      limit: limitNumber,
    };

    return {
      status: 200,
      message: "Inquiries fetched successfully",
      success: true,
      data: {
        data: inquiries,
        pagination,
      },
    };
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return {
      status: 500,
      message: "Internal server error",
      success: false,
    };
  }
};

const createRestaurantFromInquiry = async (inquiryId, session) => {
  try {
    const inquiry = await Inquiry.findById(inquiryId);
    if (!inquiry) {
      return {
        status: 404,
        message: "Inquiry not found",
        success: false,
      };
    }
    const restaurant = {
      name: inquiry.restaurantName,
    };
    const user = {
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
    };
    const data = {
      restaurant,
      user,
    };
    const restaurantResponse = await createRestaurant(data, session);
    if (!restaurantResponse.success) {
      return {
        status: restaurantResponse.status,
        message: restaurantResponse.message,
        success: false,
      };
    }
    return {
      status: 201,
      message: "Restaurant created successfully",
      success: true,
      data: restaurantResponse.data,
    };
  } catch (error) {
    console.error("Error creating restaurant from inquiry:", error);
    return {
      status: 500,
      message: "Internal server error",
      success: false,
    };
  }
};

module.exports = {
  createInquiry,
  getAllInquiries,
  createRestaurantFromInquiry,
};
