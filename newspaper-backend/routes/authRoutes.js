const express = require("express");
const { check } = require("express-validator");
const { register, login, getAllAdmins, deleteAdmin } = require("../controllers/authController");

const router = express.Router();

// Admin routes
router.post(
  "/register",
  [
    check("username", "Username is required").not().isEmpty(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
  ],
  register
);

router.post(
  "/login",
  [
    check("username", "Username is required").not().isEmpty(),
    check("password", "Password is required").exists(),
  ],
  login
);

// Get all Admins
router.get("/allAdmins", getAllAdmins);

// Delete Admin by ID
router.delete("/deleteAdmin/:name", deleteAdmin);


module.exports = router;
