const router = require("express").Router();
const {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
} = require("../controllers/restaurant.controller");
const { checkRole } = require("../middlewares/auth.middleware");
const { ADMIN } = require("../utils/constant");

router.post("/create", checkRole([ADMIN]), createRestaurant);
router.get("/all", checkRole([ADMIN]), getAllRestaurants);
router.get("/:id", checkRole([ADMIN]), getRestaurantById);
router.put("/:id", checkRole([ADMIN]), updateRestaurant);
router.delete("/:id", checkRole([ADMIN]), deleteRestaurant);

module.exports = router;
