const express = require("express");
const { authenticateUser, authorizeRoles } = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  getAllUsers,
  updateUser,
  deleteUser,
  promoteToSuperAdmin,
  promoteToAdmin,
} = require("../controllers/userController");


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getAll", authenticateUser, authorizeRoles("admin", "super_admin"), getAllUsers);
router.put("/updateUser:id", authenticateUser, authorizeRoles("admin", "super_admin"), updateUser);
router.delete("/deleteUser:name", authenticateUser, authorizeRoles("super_admin"), deleteUser);
router.patch("/promoteToAdmin:username", authenticateUser, authorizeRoles("super_admin"), promoteToAdmin);
router.patch("/promoteToSuperAdmin:username", authenticateUser, authorizeRoles("super_admin"), promoteToSuperAdmin);


module.exports = router;
