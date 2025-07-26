const router = require("express").Router();
const {
  createInquiry,
  getAllInquiries,
  createRestaurantFromInquiry,
} = require("../controllers/inquiry.controller");
const { checkRole } = require("../middlewares/auth.middleware");
const { ADMIN } = require("../utils/constant");

router.post("/create", createInquiry);
// router.get("/all", checkRole([ADMIN]), getAllInquiries);
router.get("/all",  getAllInquiries);
router.post("/create-restaurant/:id",createRestaurantFromInquiry);

module.exports = router;
