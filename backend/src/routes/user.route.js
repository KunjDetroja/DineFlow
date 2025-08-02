const router = require("express").Router();
const {
  loginUser,
  getCurrentUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");
const { verifyJWT, checkRole } = require("../middlewares/auth.middleware");
const { ADMIN, OWNER, MANAGER } = require("../utils/constant");

router.post("/login", loginUser);
router.get("/me", verifyJWT, getCurrentUser);
router.get("/all", checkRole([ADMIN, OWNER, MANAGER]), getAllUsers);
router.get("/:id", checkRole([ADMIN, OWNER, MANAGER]), getUserById);
router.put("/:id", checkRole([ADMIN, OWNER, MANAGER]), updateUser);
router.delete("/:id", checkRole([ADMIN, OWNER, MANAGER]), deleteUser);

module.exports = router;
