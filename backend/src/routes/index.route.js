const router = require("express").Router();
const inquiry = require("./inquiry.route");
const user = require("./user.route");

router.use("/inquiry", inquiry);
router.use("/user", user);

module.exports = router;
