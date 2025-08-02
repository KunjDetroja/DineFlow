const {
  createOutletSchema,
  updateOutletSchema,
} = require("../validators/outlet.validator");
const Outlet = require("../models/outlet.model");
const Restaurant = require("../models/restaurant.model");

const createOutlet = async (data, user) => {
  try {
    const { error } = createOutletSchema.validate(data);
    if (error) {
      return {
        status: 400,
        message: error.details[0].message,
        success: false,
      };
    }

    // Determine restaurant ID based on user role
    let restaurantId;
    if (user.role === "ADMIN") {
      // Admin must provide restaurant ID
      if (!data.restaurantId) {
        return {
          status: 400,
          message: "Restaurant ID is required for admin",
          success: false,
        };
      }
      restaurantId = data.restaurantId;
    } else if (user.role === "OWNER") {
      // Owner uses their restaurant ID
      if (!user.restaurantId) {
        return {
          status: 400,
          message: "Owner must be associated with a restaurant",
          success: false,
        };
      }
      restaurantId = user.restaurantId;
    } else {
      return {
        status: 403,
        message: "Unauthorized to create outlet",
        success: false,
      };
    }

    // Verify restaurant exists
    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      isDeleted: false,
    });
    if (!restaurant) {
      return {
        status: 404,
        message: "Restaurant not found",
        success: false,
      };
    }

    // Create outlet data
    const outletData = {
      ...data,
      restaurantId: restaurantId,
    };

    const outlet = new Outlet(outletData);
    const newOutlet = await outlet.save();

    // Populate restaurant data
    await newOutlet.populate("restaurantId", "name logo");

    return {
      status: 201,
      message: "Outlet created successfully",
      success: true,
      data: newOutlet,
    };
  } catch (error) {
    console.error("Error creating outlet:", error);
    return {
      status: 500,
      message: "Internal server error",
      success: false,
    };
  }
};

const getAllOutlets = async (req_query, user) => {
  try {
    const { page = 1, limit = 10, search = "", status = "" } = req_query;
    const pageNumber = Number.isInteger(parseInt(page, 10))
      ? parseInt(page, 10)
      : 1;
    const limitNumber = Number.isInteger(parseInt(limit, 10))
      ? parseInt(limit, 10)
      : 10;
    const skip = (pageNumber - 1) * limitNumber;

    // Build search query - exclude soft deleted outlets
    const searchQuery = { isDeleted: false };

    // Filter by restaurant based on user role
    if (user.role === "OWNER") {
      if (!user.restaurantId) {
        return {
          status: 400,
          message: "Owner must be associated with a restaurant",
          success: false,
        };
      }
      searchQuery.restaurantId = user.restaurantId;
    } else if (user.role === "ADMIN") {
      // Admin can see all outlets, no additional filter needed
    } else {
      return {
        status: 403,
        message: "Unauthorized to view outlets",
        success: false,
      };
    }

    if (search && search.trim() !== "") {
      searchQuery.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { address: { $regex: search.trim(), $options: "i" } },
        { city: { $regex: search.trim(), $options: "i" } },
      ];
    }
    if (status && status.trim() !== "") {
      searchQuery.isActive = status.trim() === "true" ? true : false;
    }

    const outlets = await Outlet.find(searchQuery)
      .populate("restaurantId", "name logo")
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 });

    const totalOutlets = await Outlet.countDocuments(searchQuery);

    if (!outlets || outlets.length === 0) {
      return {
        status: 404,
        message: search
          ? "No outlets found matching your search"
          : "No outlets found",
        success: false,
      };
    }

    const totalPages = Math.ceil(totalOutlets / limitNumber);
    const pagination = {
      totalItems: totalOutlets,
      totalPages,
      currentPage: pageNumber,
      limit: limitNumber,
    };

    return {
      status: 200,
      message: search
        ? "Outlets found matching your search"
        : "Outlets fetched successfully",
      success: true,
      data: {
        data: outlets,
        pagination,
      },
    };
  } catch (error) {
    console.error("Error fetching outlets:", error);
    return {
      status: 500,
      message: "Internal server error",
      success: false,
    };
  }
};

const getOutletById = async (id, user) => {
  try {
    if (!id) {
      return {
        status: 400,
        message: "Outlet ID is required",
        success: false,
      };
    }

    const searchQuery = { _id: id, isDeleted: false };

    // Filter by restaurant based on user role
    if (user.role === "OWNER") {
      if (!user.restaurantId) {
        return {
          status: 400,
          message: "Owner must be associated with a restaurant",
          success: false,
        };
      }
      searchQuery.restaurantId = user.restaurantId;
    } else if (user.role !== "ADMIN") {
      return {
        status: 403,
        message: "Unauthorized to view outlet",
        success: false,
      };
    }

    const outlet = await Outlet.findOne(searchQuery).populate(
      "restaurantId",
      "name logo"
    );

    if (!outlet) {
      return {
        status: 404,
        message: "Outlet not found",
        success: false,
      };
    }

    return {
      status: 200,
      message: "Outlet fetched successfully",
      success: true,
      data: outlet,
    };
  } catch (error) {
    console.error("Error fetching outlet:", error);
    return {
      status: 500,
      message: "Internal server error",
      success: false,
    };
  }
};

const updateOutlet = async (id, data, user) => {
  try {
    if (!id) {
      return {
        status: 400,
        message: "Outlet ID is required",
        success: false,
      };
    }

    const { error } = updateOutletSchema.validate(data);
    if (error) {
      return {
        status: 400,
        message: error.details[0].message,
        success: false,
      };
    }

    const searchQuery = { _id: id, isDeleted: false };

    // Filter by restaurant based on user role
    if (user.role === "OWNER") {
      if (!user.restaurantId) {
        return {
          status: 400,
          message: "Owner must be associated with a restaurant",
          success: false,
        };
      }
      searchQuery.restaurantId = user.restaurantId;
    } else if (user.role !== "ADMIN") {
      return {
        status: 403,
        message: "Unauthorized to update outlet",
        success: false,
      };
    }

    const outlet = await Outlet.findOne(searchQuery);

    if (!outlet) {
      return {
        status: 404,
        message: "Outlet not found",
        success: false,
      };
    }

    const updatedOutlet = await Outlet.findByIdAndUpdate(
      id,
      { ...data },
      { new: true, runValidators: true }
    ).populate("restaurantId", "name logo");

    return {
      status: 200,
      message: "Outlet updated successfully",
      success: true,
      data: updatedOutlet,
    };
  } catch (error) {
    console.error("Error updating outlet:", error);
    return {
      status: 500,
      message: "Internal server error",
      success: false,
    };
  }
};

const deleteOutlet = async (id, user) => {
  try {
    if (!id) {
      return {
        status: 400,
        message: "Outlet ID is required",
        success: false,
      };
    }

    const searchQuery = { _id: id, isDeleted: false };

    // Filter by restaurant based on user role
    if (user.role === "OWNER") {
      if (!user.restaurantId) {
        return {
          status: 400,
          message: "Owner must be associated with a restaurant",
          success: false,
        };
      }
      searchQuery.restaurantId = user.restaurantId;
    } else if (user.role !== "ADMIN") {
      return {
        status: 403,
        message: "Unauthorized to delete outlet",
        success: false,
      };
    }

    const outlet = await Outlet.findOne(searchQuery);

    if (!outlet) {
      return {
        status: 404,
        message: "Outlet not found",
        success: false,
      };
    }

    // Soft delete
    await Outlet.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

    return {
      status: 200,
      message: "Outlet deleted successfully",
      success: true,
    };
  } catch (error) {
    console.error("Error deleting outlet:", error);
    return {
      status: 500,
      message: "Internal server error",
      success: false,
    };
  }
};

module.exports = {
  createOutlet,
  getAllOutlets,
  getOutletById,
  updateOutlet,
  deleteOutlet,
};
