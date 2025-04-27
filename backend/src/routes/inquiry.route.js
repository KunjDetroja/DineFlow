const router = require("express").Router();
const {
  createInquiry,
  getAllInquiries,
} = require("../controllers/inquiry.controller");
const { checkRole } = require("../middlewares/auth.middleware");
const { ADMIN } = require("../utils/constant");

router.post("/", createInquiry);
router.get("/all", checkRole([ADMIN]), getAllInquiries);

module.exports = router;
