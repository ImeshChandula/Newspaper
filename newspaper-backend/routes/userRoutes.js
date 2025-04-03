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
  getAllSuperAdmins,
  getAllAdmins,
  getAllEditors,
} = require("../controllers/userController");


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getAllUsers", getAllUsers);
router.get("/getAllEditors", getAllEditors);
router.get("/getAllAdmins", authenticateUser, authorizeRoles("super_admin"), getAllAdmins);
router.get("/getAllSuperAdmins", authenticateUser, authorizeRoles("super_admin"), getAllSuperAdmins);
router.patch("/updateUser:id", authenticateUser, authorizeRoles("super_admin"), updateUser);
router.delete("/deleteUser:name", authenticateUser, authorizeRoles("super_admin"), deleteUser);
router.patch("/promoteToAdmin:username", authenticateUser, authorizeRoles("super_admin"), promoteToAdmin);
router.patch("/promoteToSuperAdmin:username", authenticateUser, authorizeRoles("super_admin"), promoteToSuperAdmin);


//router.get("/getAllUsers", authenticateUser, authorizeRoles("admin", "super_admin"), getAllUsers);
//router.get("/getAllEditors", authenticateUser, authorizeRoles("admin", "super_admin"), getAllEditors);
//router.get("/getAllAdmins", authenticateUser, authorizeRoles("admin", "super_admin"), getAllAdmins);
//router.get("/getAllSuperAdmins", authenticateUser, authorizeRoles("super_admin"), getAllSuperAdmins);
//router.put("/updateUser:id", authenticateUser, authorizeRoles("super_admin"), updateUser);
//router.delete("/deleteUser:name", authenticateUser, authorizeRoles("super_admin"), deleteUser);
//router.patch("/promoteToAdmin:username", authenticateUser, authorizeRoles("super_admin"), promoteToAdmin);
//router.patch("/promoteToSuperAdmin:username", authenticateUser, authorizeRoles("super_admin"), promoteToSuperAdmin);


module.exports = router;
