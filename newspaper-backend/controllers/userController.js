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


// @desc Register Admin
// @route POST /api/users/registerAdmin
const registerAdmin = async (req, res) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

const { username, password, role } = req.body;

try {
  let user = await User.findOne({ username });
  if (user) {
    return res.status(400).json({ msg: "Admin already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  user = new User({
    username,
    password: hashedPassword,
    role: role || "admin", // Default role
  });

  await user.save();

  res.status(201).json({ msg: "Admin registered successfully" });
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
// @route GET /api/users/getAllUsers
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Get All Editors
// @route GET /api/users/getAllEditors
const getAllEditors = async (req, res) => {
    try {
      const admins = await User.find({ role: "editor" }, "-password");
      res.json(admins);
    } catch (error) {
      console.error("Error fetching editors:", error);
      res.status(500).json({ message: "Server error" });
    }
  };


// @desc Get All Admins
// @route GET /api/users/getAllAdmins
const getAllAdmins = async (req, res) => {
    try {
      const admins = await User.find({ role: "admin" }, "-password");
      res.json(admins);
    } catch (error) {
      console.error("Error fetching admins:", error);
      res.status(500).json({ message: "Server error" });
    }
  };


  // @desc Get All Admins
// @route GET /api/users/getAllSuperAdmins
const getAllSuperAdmins = async (req, res) => {
    try {
      const admins = await User.find({ role: "super_admin" }, "-password");
      res.json(admins);
    } catch (error) {
      console.error("Error fetching super admin:", error);
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


// @desc Delete User (Only Admin or Super Admin, but they can't delete themselves)
// @route DELETE /api/users/deleteUser/:username
const deleteUser = async (req, res) => {
    try {
      const { username } = req.params;
  
      // Prevent a user from deleting themselves
      if (req.user.username === username) {
        return res.status(403).json({ message: "You cannot delete your own account" });
      }
  
      const deletedUser = await User.findOneAndDelete({ username });
  
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json({ message: `User '${username}' deleted successfully` });
    } catch (error) {
      console.error("Error deleting user:", error);
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
  registerAdmin,
  loginUser,
  getAllUsers,
  updateUser,
  deleteUser,
  promoteToSuperAdmin,
  promoteToAdmin,
  getAllSuperAdmins,
  getAllAdmins,
  getAllEditors,
};
