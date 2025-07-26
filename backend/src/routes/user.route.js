const router = require("express").Router();
const { loginUser, getCurrentUser } = require("../controllers/user.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

router.post("/login", loginUser);
router.get("/me", verifyJWT, getCurrentUser);

module.exports = router;
