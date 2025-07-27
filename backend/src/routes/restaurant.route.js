const router = require("express").Router();
const {
  createRestaurant,
  getAllRestaurants,
} = require("../controllers/restaurant.controller");
const { checkRole } = require("../middlewares/auth.middleware");
const { ADMIN } = require("../utils/constant");

router.post("/create", checkRole([ADMIN]), createRestaurant);
router.get("/all", checkRole([ADMIN]), getAllRestaurants);

module.exports = router;
