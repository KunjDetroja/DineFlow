const router = require("express").Router();
const inquiry = require("./inquiry.route");
const user = require("./user.route");
const restaurant = require("./restaurant.route");

router.use("/inquiry", inquiry);
router.use("/user", user);
router.use("/restaurant", restaurant);

module.exports = router;
