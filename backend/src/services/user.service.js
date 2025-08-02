const User = require("../models/user.model");
const Outlet = require("../models/outlet.model");
const mongoose  = require("mongoose");
const { CHEF, WAITER, MANAGER, ADMIN, OWNER } = require("../utils/constant");
const {
  loginUserSchema,
  createUserSchema,
  updateUserSchema,
} = require("../validators/user.validator");
const jwt = require("jsonwebtoken");

// Helper function to check role hierarchy: ADMIN > OWNER > MANAGER > OTHERS
const canAccessUser = (currentUser, targetUser) => {
  const roleHierarchy = {
    ADMIN: 4,
    OWNER: 3,
    MANAGER: 2,
    CHEF: 1,
    WAITER: 1,
    CUSTOMER: 1,
  };

  console.log("currentUser", currentUser);
  console.log("targetUser", targetUser);

  const currentUserLevel = roleHierarchy[currentUser.role] || 0;
  const targetUserLevel = roleHierarchy[targetUser.role] || 0;

  // Admin can access anyone
  if (currentUser.role === ADMIN) return true;

  // Owner can access users in their restaurant (except other owners and admins)
  if (currentUser.role === OWNER) {
    if (targetUser.role === ADMIN) return false;
    if (
      targetUser.role === OWNER &&
      targetUser._id.toString() !== currentUser._id.toString()
    )
      return false;
    return (
      targetUser.restaurantId?.toString() ===
      currentUser.restaurantId?.toString()
    );
  }

  // Manager can access users in their outlet (except owners and admins)
  if (currentUser.role === MANAGER) {
    if ([ADMIN, OWNER].includes(targetUser.role)) return false;
    return (
      targetUser.outletId?.toString() === currentUser.outletId?.toString() &&
      targetUser.restaurantId?.toString() ===
        currentUser.restaurantId?.toString()
    );
  }

  // Others can only access themselves
  return targetUser._id.toString() === currentUser._id.toString();
};

const createUser = async (data, session, currentUser) => {
  try {
    const { error } = createUserSchema.validate(data);
    if (error) {
      return {
        status: 400,
        message: error.details[0].message,
        success: false,
      };
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return {
        status: 400,
        message: "Email already exists",
        success: false,
      };
    }

    // Role hierarchy validation: ADMIN > OWNER > MANAGER > others
    const roleHierarchy = {
      ADMIN: 4,
      OWNER: 3,
      MANAGER: 2,
      CHEF: 1,
      WAITER: 1,
      CUSTOMER: 1,
    };

    const currentUserLevel = roleHierarchy[currentUser.role] || 0;
    const targetUserLevel = roleHierarchy[data.role] || 0;

    // Rule 1: No one can create ADMIN
    if (data.role === ADMIN) {
      return {
        status: 403,
        message: "ADMIN role cannot be created",
        success: false,
      };
    }

    // Rule 2: Role creation permissions based on hierarchy
    if (currentUser.role === ADMIN) {
      // Admin can create any role except ADMIN
    } else if (currentUser.role === OWNER) {
      // Owner can create OWNER or lower roles
      if (targetUserLevel > roleHierarchy[OWNER]) {
        return {
          status: 403,
          message: "You can only create OWNER or lower level roles",
          success: false,
        };
      }
    } else if (currentUser.role === MANAGER) {
      // Manager can create MANAGER or lower roles
      if (targetUserLevel > roleHierarchy[MANAGER]) {
        return {
          status: 403,
          message: "You can only create MANAGER or lower level roles",
          success: false,
        };
      }
    } else {
      return {
        status: 403,
        message: "You don't have permission to create users",
        success: false,
      };
    }

    const isStaff = [CHEF, WAITER, MANAGER].includes(data.role);
    const isOwner = data.role === OWNER;

    // Validate required fields for staff roles
    if (isStaff && !data.outletId) {
      return {
        status: 400,
        message: "Outlet ID is required for staff roles",
        success: false,
      };
    }
    if (isStaff && !data.restaurantId) {
      return {
        status: 400,
        message: "Restaurant ID is required for staff roles",
        success: false,
      };
    }
    if (isOwner && !data.restaurantId) {
      return {
        status: 400,
        message: "Restaurant ID is required for OWNER role",
        success: false,
      };
    }

    // Rule 3: Restaurant/Outlet validation based on creator's role
    if (currentUser.role === OWNER) {
      // Owner can only create users in their own restaurant
      if (
        data.restaurantId &&
        data.restaurantId.toString() !== currentUser.restaurantId.toString()
      ) {
        return {
          status: 403,
          message: "You can only create users in your own restaurant",
          success: false,
        };
      }
      // Set restaurant ID to owner's restaurant if not provided
      if (!data.restaurantId) {
        data.restaurantId = currentUser.restaurantId;
      }
    } else if (currentUser.role === MANAGER) {
      // Manager can only create users in their own restaurant and outlet
      if (
        data.restaurantId &&
        data.restaurantId.toString() !== currentUser.restaurantId.toString()
      ) {
        return {
          status: 403,
          message: "You can only create users in your own restaurant",
          success: false,
        };
      }
      if (
        isStaff &&
        data.outletId &&
        data.outletId.toString() !== currentUser.outletId.toString()
      ) {
        return {
          status: 403,
          message: "You can only create staff in your own outlet",
          success: false,
        };
      }
      // Set restaurant and outlet IDs to manager's if not provided
      if (!data.restaurantId) {
        data.restaurantId = currentUser.restaurantId;
      }
      if (isStaff && !data.outletId) {
        data.outletId = currentUser.outletId;
      }
    }

    // Rule 4: Validate that outlet belongs to the specified restaurant
    if (data.outletId && data.restaurantId) {
      const outlet = await Outlet.findOne({
        _id: data.outletId,
        restaurantId: data.restaurantId,
        isDeleted: false,
        isActive: true,
      });

      if (!outlet) {
        return {
          status: 400,
          message:
            "The specified outlet does not belong to the specified restaurant or is not active",
          success: false,
        };
      }
    }

    const newUserData = new User(data);
    const newUser = await newUserData.save({ session });
    return {
      status: 201,
      message: "User created successfully",
      success: true,
      data: newUser,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      status: 500,
      message: "Internal server error",
      success: false,
    };
  }
};

const loginUser = async (data) => {
  try {
    const { error } = loginUserSchema.validate(data);
    console.log("Validation error:", error);
    if (error) {
      return {
        status: 400,
        message: error.details[0].message,
        success: false,
      };
    }

    const { email, password } = data;

    // First, find user with password for authentication
    const userForAuth = await User.findOne({
      email,
      isActive: true,
      isDeleted: false,
    }).select("+password");

    if (!userForAuth) {
      return {
        status: 401,
        message: "Invalid email or password",
        success: false,
      };
    }

    const isMatch = await userForAuth.comparePassword(password);
    if (!isMatch) {
      return {
        status: 401,
        message: "Invalid email or password",
        success: false,
      };
    }

    // Now get user with restaurant/outlet data using aggregation
    const pipeline = [
      {
        $match: {
          _id: userForAuth._id,
          isActive: true,
          isDeleted: false,
        },
      },
      {
        $project: {
          password: 0, // Exclude password field
        },
      },
      {
        $lookup: {
          from: "restaurants",
          let: { restaurantId: "$restaurantId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$restaurantId"] },
                    { $eq: ["$isActive", true] },
                    { $eq: ["$isDeleted", false] },
                  ],
                },
              },
            },
          ],
          as: "restaurant",
        },
      },
      {
        $lookup: {
          from: "outlets",
          let: { outletId: "$outletId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$outletId"] },
                    { $eq: ["$isActive", true] },
                    { $eq: ["$isDeleted", false] },
                  ],
                },
              },
            },
          ],
          as: "outlet",
        },
      },
      {
        $addFields: {
          restaurant: { $arrayElemAt: ["$restaurant", 0] },
          outlet: { $arrayElemAt: ["$outlet", 0] },
        },
      },
    ];

    const result = await User.aggregate(pipeline);
    const user = result[0];

    const payload = {
      id: user._id,
    };
    const tokenExpires = "8d";
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: tokenExpires,
    });

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      restaurant: user.restaurant,
      outlet: user.outlet,
      token,
    };
    return {
      status: 200,
      message: "User logged in successfully",
      success: true,
      data: userData,
    };
  } catch (error) {
    console.error("Error logging in user:", error);
    return {
      status: 500,
      message: "Internal server error",
      success: false,
    };
  }
};

const getCurrentUser = async (userId) => {
  try {
    const pipeline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
          isActive: true,
          isDeleted: false,
        },
      },
      {
        $project: {
          password: 0, // Exclude password field
        },
      },
      {
        $lookup: {
          from: "restaurants",
          let: { restaurantId: "$restaurantId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$restaurantId"] },
                    { $eq: ["$isActive", true] },
                    { $eq: ["$isDeleted", false] },
                  ],
                },
              },
            },
          ],
          as: "restaurant",
        },
      },
      {
        $lookup: {
          from: "outlets",
          let: { outletId: "$outletId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$outletId"] },
                    { $eq: ["$isActive", true] },
                    { $eq: ["$isDeleted", false] },
                  ],
                },
              },
            },
          ],
          as: "outlet",
        },
      },
      {
        $addFields: {
          restaurant: { $arrayElemAt: ["$restaurant", 0] },
          outlet: { $arrayElemAt: ["$outlet", 0] },
        },
      },
    ];

    const result = await User.aggregate(pipeline);
    const user = result[0];

    if (!user) {
      return { success: false, statusCode: 404, message: "User not found" };
    }

    return { success: true, statusCode: 200, data: user };
  } catch (error) {
    console.error("Error getting current user:", error);
    return {
      status: 500,
      message: "Internal server error",
      success: false,
    };
  }
};

const getAllUsers = async (req_query, currentUser) => {
  try {
    const { page = 1, limit = 10, search = "", status = "" } = req_query;
    const pageNumber = Number.isInteger(parseInt(page, 10))
      ? parseInt(page, 10)
      : 1;
    const limitNumber = Number.isInteger(parseInt(limit, 10))
      ? parseInt(limit, 10)
      : 10;
    const skip = (pageNumber - 1) * limitNumber;

    // Build match stage for aggregation
    const matchStage = { isDeleted: false };

    // Add search functionality if search term is provided
    if (search && search.trim() !== "") {
      matchStage.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { email: { $regex: search.trim(), $options: "i" } },
        { phone: { $regex: search.trim(), $options: "i" } },
      ];
    }

    // Add status filter if provided
    if (status && status.trim() !== "") {
      matchStage.isActive = status.trim() === "true" ? true : false;
    }

    // Role-based filtering
    switch (currentUser.role) {
      case ADMIN:
        // Admin can see all users
        break;

      case OWNER:
        // Owner can see all users under their restaurant
        matchStage.restaurantId = currentUser.restaurantId;
        break;

      case MANAGER:
        // Manager can see users from the same outlet
        matchStage.outletId = currentUser.outletId;
        matchStage.restaurantId = currentUser.restaurantId;
        break;

      default:
        return {
          status: 403,
          message: "Access denied. Insufficient permissions to view users.",
          success: false,
        };
    }

    // Aggregation pipeline
    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: "restaurants",
          localField: "restaurantId",
          foreignField: "_id",
          as: "restaurantId",
          pipeline: [{ $project: { name: 1, logo: 1 } }],
        },
      },
      {
        $lookup: {
          from: "outlets",
          localField: "outletId",
          foreignField: "_id",
          as: "outletId",
          pipeline: [{ $project: { name: 1, address: 1 } }],
        },
      },
      {
        $unwind: {
          path: "$restaurantId",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$outletId",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          password: 0, // Exclude password field
        },
      },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limitNumber }],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const result = await User.aggregate(pipeline);
    const users = result[0].data;
    const totalUsers = result[0].totalCount[0]?.count || 0;

    if (!users || users.length === 0) {
      return {
        status: 404,
        message: search
          ? "No users found matching your search"
          : "No users found",
        success: false,
      };
    }

    const totalPages = Math.ceil(totalUsers / limitNumber);
    const pagination = {
      totalItems: totalUsers,
      totalPages,
      currentPage: pageNumber,
      limit: limitNumber,
    };

    return {
      status: 200,
      message: search
        ? "Users found matching your search"
        : "Users fetched successfully",
      success: true,
      data: {
        data: users,
        pagination,
      },
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      status: 500,
      message: "Internal server error",
      success: false,
    };
  }
};

const getUserById = async (id, currentUser) => {
  try {
    if (!id) {
      return {
        status: 400,
        message: "User ID is required",
        success: false,
      };
    }

    const pipeline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
          isDeleted: false,
        },
      },
      {
        $project: {
          password: 0, // Exclude password field
        },
      },
      {
        $lookup: {
          from: "restaurants",
          let: { restaurantId: "$restaurantId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$restaurantId"] },
                    { $eq: ["$isActive", true] },
                    { $eq: ["$isDeleted", false] },
                  ],
                },
              },
            },
            {
              $project: {
                name: 1,
                logo: 1,
              },
            },
          ],
          as: "restaurant",
        },
      },
      {
        $lookup: {
          from: "outlets",
          let: { outletId: "$outletId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$outletId"] },
                    { $eq: ["$isActive", true] },
                    { $eq: ["$isDeleted", false] },
                  ],
                },
              },
            },
            {
              $project: {
                name: 1,
                address: 1,
              },
            },
          ],
          as: "outlet",
        },
      },
      {
        $addFields: {
          restaurant: { $arrayElemAt: ["$restaurant", 0] },
          outlet: { $arrayElemAt: ["$outlet", 0] },
        },
      },
    ];

    const result = await User.aggregate(pipeline);
    const user = result[0];
    if (!user) {
      return {
        status: 404,
        message: "User not found",
        success: false,
      };
    }

    // Check if current user can access this user
    if (!canAccessUser(currentUser, user)) {
      return {
        status: 403,
        message: "Access denied. Insufficient permissions to view this user.",
        success: false,
      };
    }

    return {
      status: 200,
      message: "User fetched successfully",
      success: true,
      data: user,
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return {
      status: 500,
      message: "Internal server error",
      success: false,
    };
  }
};

const updateUser = async (id, data, currentUser) => {
  try {
    if (!id) {
      return {
        status: 400,
        message: "User ID is required",
        success: false,
      };
    }

    const { error } = updateUserSchema.validate(data);
    if (error) {
      return {
        status: 400,
        message: error.details[0].message,
        success: false,
      };
    }

    const user = await User.findOne({ _id: id, isDeleted: false });

    if (!user) {
      return {
        status: 404,
        message: "User not found",
        success: false,
      };
    }

    // Check if current user can access this user
    if (!canAccessUser(currentUser, user)) {
      return {
        status: 403,
        message: "Access denied. Insufficient permissions to update this user.",
        success: false,
      };
    }

    // Check if email is being updated and already exists
    if (data.email && data.email !== user.email) {
      const existingUser = await User.findOne({
        email: data.email,
        _id: { $ne: id },
        isDeleted: false,
      });
      if (existingUser) {
        return {
          status: 400,
          message: "Email already exists",
          success: false,
        };
      }
    }

    // Role change validation
    if (data.role && data.role !== user.role) {
      // Only admin can change roles to ADMIN or OWNER
      if ([ADMIN, OWNER].includes(data.role) && currentUser.role !== ADMIN) {
        return {
          status: 403,
          message: "Only admin can assign ADMIN or OWNER roles",
          success: false,
        };
      }

      // Owner can't change their own role or other owner's role
      if (currentUser.role === OWNER && user.role === OWNER) {
        return {
          status: 403,
          message: "Cannot change owner role",
          success: false,
        };
      }
    }

    // Validate outlet and restaurant requirements for staff roles
    const isStaff = [CHEF, WAITER, MANAGER].includes(data.role || user.role);
    if (isStaff) {
      if (!data.outletId && !user.outletId) {
        return {
          status: 400,
          message: "Outlet ID is required for staff roles",
          success: false,
        };
      }
      if (!data.restaurantId && !user.restaurantId) {
        return {
          status: 400,
          message: "Restaurant ID is required for staff roles",
          success: false,
        };
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { ...data },
      { new: true, runValidators: true }
    )
      .populate("restaurantId", "name logo")
      .populate("outletId", "name address")
      .select("-password");

    return {
      status: 200,
      message: "User updated successfully",
      success: true,
      data: updatedUser,
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      status: 500,
      message: "Internal server error",
      success: false,
    };
  }
};

const deleteUser = async (id, currentUser) => {
  try {
    if (!id) {
      return {
        status: 400,
        message: "User ID is required",
        success: false,
      };
    }

    const user = await User.findOne({ _id: id, isDeleted: false });

    if (!user) {
      return {
        status: 404,
        message: "User not found",
        success: false,
      };
    }

    // Check if current user can access this user
    if (!canAccessUser(currentUser, user)) {
      return {
        status: 403,
        message: "Access denied. Insufficient permissions to delete this user.",
        success: false,
      };
    }

    // Prevent self-deletion
    if (user._id.toString() === currentUser._id.toString()) {
      return {
        status: 400,
        message: "Cannot delete your own account",
        success: false,
      };
    }

    // Prevent deleting other admins (only admin can delete admin)
    if (user.role === ADMIN && currentUser.role !== ADMIN) {
      return {
        status: 403,
        message: "Only admin can delete admin accounts",
        success: false,
      };
    }

    // Soft delete
    await User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

    return {
      status: 200,
      message: "User deleted successfully",
      success: true,
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      status: 500,
      message: "Internal server error",
      success: false,
    };
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
