const router = require("express").Router();
const {
  loginUser,
  getCurrentUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
} = require("../controllers/user.controller");
const { verifyJWT, checkRole } = require("../middlewares/auth.middleware");
const { ADMIN, OWNER, MANAGER } = require("../utils/constant");

router.post("/login", loginUser);
router.get("/me", verifyJWT, getCurrentUser);
router.post("/create", checkRole([ADMIN, OWNER, MANAGER]), createUser);
router.get("/all", checkRole([ADMIN, OWNER, MANAGER]), getAllUsers);
router.get("/:id", checkRole([ADMIN, OWNER, MANAGER]), getUserById);
router.put("/:id", checkRole([ADMIN, OWNER, MANAGER]), updateUser);
router.delete("/:id", checkRole([ADMIN, OWNER, MANAGER]), deleteUser);

module.exports = router;
