const router = require("express").Router();
const { createRestaurant } = require("../controllers/restaurant.controller");
const { checkRole } = require("../middlewares/auth.middleware");
const { ADMIN } = require("../utils/constant");

router.post("/create",checkRole([ADMIN]), createRestaurant);

module.exports = router;