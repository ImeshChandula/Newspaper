const SuperAdmin = require("../models/SuperAdmin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

// @desc Register Admin
// @route POST /api/auth/superAdmin/register
const register_super = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    let admin = await SuperAdmin.findOne({ username });
    if (admin) {
      return res.status(400).json({ msg: "Super Admin already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    admin = new SuperAdmin({
      username,
      password: hashedPassword,
    });

    await admin.save();

    res.status(201).json({ msg: "Super Admin registered successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc Login Admin
// @route POST /api/auth/superAdmin/login
const login_super = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    let admin = await SuperAdmin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = { id: admin.id, username: admin.username };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};


// @desc Get all Super Admin
// @route GET /api/auth/superAdmin/allSuperAdmins
const getAllAdmins_super = async (req, res) => {
  try {
    const admins = await SuperAdmin.find({}, "-password");
    res.json(admins);
  } catch (error) {
    console.error("Error fetching Super Admins:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Delete Super Admin by name
// @route DELETE /api/auth/superAdmin/admins/:name
const deleteAdmin_super = async (req, res) => {
  try {
    const { adminName } = req.params;
    const deletedAdmin = await SuperAdmin.findOneAndDelete({ adminName });

    if (!deletedAdmin) {
      return res.status(404).json({ message: "Super Admin not found" });
    }

    res.json({ message: "Super Admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting super admin:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register_super, login_super, getAllAdmins_super, deleteAdmin_super };
