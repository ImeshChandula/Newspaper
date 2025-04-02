const express = require("express");
const { check } = require("express-validator");
const { register_super, login_super, getAllAdmins_super, deleteAdmin_super } = require("../controllers/authControllerSuper");

const router = express.Router();

// Super Admin routes
router.post(
  "/register",
  [
    check("username", "Username is required").not().isEmpty(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
  ],
  register_super
);

router.post(
  "/login",
  [
    check("username", "Username is required").not().isEmpty(),
    check("password", "Password is required").exists(),
  ],
  login_super
);

// Get all Admins
router.get("/allSuperAdmins", getAllAdmins_super);

// Delete Admin by ID
router.delete("/deleteAdmin/:name", deleteAdmin_super);

module.exports = router;
