const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");


// @desc Register User
// @route POST /api/users/register
const registerUser = async (req, res) => {
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

  const { username, password, role } = req.body;

  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      username,
      password: hashedPassword,
      role: role || "editor", // Default role
    });

    await user.save();

    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc Login User
// @route POST /api/users/login
const loginUser = async (req, res) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials (Not User)" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = { id: user.id, username: user.username, role: user.role };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc Get All Users
// @route GET /api/users/getAll
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
};



// @desc Update User (Only Admin or Super Admin)
// @route PUT /api/users/updateUser:id
const updateUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username || user.username;
    user.password = password || user.password;
    user.role = role || user.role;

    await user.save();

    res.json({ message: "User updated successfully", user });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Delete User (Only Admin or Super Admin)
// @route DELETE /api/users/deleteUser:name
const deleteUser = async (req, res) => {
  try {
    const { username } = req.params;
    const deletedAdmin = await User.findOneAndDelete({ username });

    if (!deletedAdmin) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Promote an Admin to Super Admin
// @route PATCH /api/users/promoteToSuperAdmin/:username
const promoteToSuperAdmin = async (req, res) => {
  try {
    const { username } = req.params;

    const admin = await User.findOne({ username });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (admin.role === "super_admin") {
      return res.status(400).json({ message: "User is already a Super Admin" });
    }

    admin.role = "super_admin";
    await admin.save();

    res.json({ message: "Admin promoted to Super Admin successfully" });
  } catch (error) {
    console.error("Error promoting admin:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Promote an Editor to Admin
// @route PATCH /api/users/promoteToAdmin/:username
const promoteToAdmin = async (req, res) => {
    try {
      const { username } = req.params;
  
      const admin = await User.findOne({ username });
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }
  
      if (admin.role === "admin") {
        return res.status(400).json({ message: "Editor is already an Admin" });
      }
  
      admin.role = "admin";
      await admin.save();
  
      res.json({ message: "Editor promoted to Admin successfully" });
    } catch (error) {
      console.error("Error promoting admin:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  updateUser,
  deleteUser,
  promoteToSuperAdmin,
  promoteToAdmin,
};
