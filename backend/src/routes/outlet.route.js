const router = require("express").Router();
const {
  createOutlet,
  getAllOutlets,
  getOutletById,
  updateOutlet,
  deleteOutlet,
} = require("../controllers/outlet.controller");
const { checkRole } = require("../middlewares/auth.middleware");
const { ADMIN, OWNER } = require("../utils/constant");

// Both admin and owner can create outlets
router.post("/create", checkRole([ADMIN, OWNER]), createOutlet);

// Both admin and owner can view outlets (filtered by their access)
router.get("/all", checkRole([ADMIN, OWNER]), getAllOutlets);

// Both admin and owner can view specific outlet (filtered by their access)
router.get("/:id", checkRole([ADMIN, OWNER]), getOutletById);

// Both admin and owner can update outlets (filtered by their access)
router.put("/:id", checkRole([ADMIN, OWNER]), updateOutlet);

// Both admin and owner can delete outlets (filtered by their access)
router.delete("/:id", checkRole([ADMIN, OWNER]), deleteOutlet);

module.exports = router;