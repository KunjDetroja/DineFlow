const router = require("express").Router();
const { loginUser } = require("../controllers/user.controller");

router.post("/login", loginUser);

module.exports = router;