const User = require("../models/user.model");
const { errorResponse, catchResponse } = require("../utils/response");
const { ADMIN } = require("../utils/constant");
const jwt = require("jsonwebtoken");

const verifyJWT = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader) {
      return errorResponse(res, 401, "Unauthorized: No token provided");
    }

    const token = authorizationHeader.split(" ")[1];
    if (!token) {
      return errorResponse(res, 401, "Unauthorized: No token provided");
    }

    const decodedUser = jwt.decode(token, process.env.JWT_SECRET);

    if (!decodedUser) {
      return errorResponse(res, 401, "Unauthorized: Invalid token");
    }
    const user = await User.findById(decodedUser.id);

    if (!user) {
      return errorResponse(res, 404, "User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    return catchResponse(res, error);
  }
};

// Check User role has permission to access the resource
const checkRole = (allowedRoles) => async (req, res, next) => {
  try {
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader) {
      return errorResponse(res, 401, "Unauthorized: No token provided");
    }

    const token = authorizationHeader.split(" ")[1];
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    if (!decoded) {
      return errorResponse(res, 401, "Unauthorized: Invalid token");
    }

    const id = decodedUser.id;
    const user = await User.findOne({ _id: id });
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    req.user = user;

    // Check if the decoded token role is in the allowedRoles array
    if (
      (req.user && allowedRoles.includes(req.user.role)) ||
      req.user.role === ADMIN
    ) {
      next();
    } else {
      return errorResponse(
        res,
        403,
        "Forbidden: Access denied for this resource"
      );
    }
  } catch (err) {
    console.error(err);
    return catchResponse(res);
  }
};

module.exports = {
  checkRole,
  verifyJWT,
};
