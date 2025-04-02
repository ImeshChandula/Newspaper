const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

// @desc Register Admin
// @route POST /api/auth/admin/register
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    let admin = await Admin.findOne({ username });
    if (admin) {
      return res.status(400).json({ msg: "Admin already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    admin = new Admin({
      username,
      password: hashedPassword,
    });

    await admin.save();

    res.status(201).json({ msg: "Admin registered successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc Login Admin
// @route POST /api/auth/admin/login
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    let admin = await Admin.findOne({ username });
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

// @desc Get all Admins
// @route GET /api/auth/admin/allAdmins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}, "-password");
    res.json(admins);
  } catch (error) {
    console.error("Error fetching Admins:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Delete Admin by name
// @route DELETE /api/auth/admin/deleteAdmin/:name
const deleteAdmin = async (req, res) => {
  try {
    const { adminName } = req.params;
    const deletedAdmin = await Admin.findOneAndDelete({ adminName });

    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { register, login, getAllAdmins, deleteAdmin };
