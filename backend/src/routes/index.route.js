const router = require("express").Router();
const inquiry = require("./inquiry.route");
const user = require("./user.route");
const restaurant = require("./restaurant.route");
const outlet = require("./outlet.route");

router.use("/inquiry", inquiry);
router.use("/user", user);
router.use("/restaurant", restaurant);
router.use("/outlet", outlet);

module.exports = router;
