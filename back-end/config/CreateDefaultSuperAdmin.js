const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Create a default Super Admin
const createDefaultSuperAdmin = async () => {
    try {
        const existingSuperAdmin = await User.findOne({ username: "superAdmin" });
        if (!existingSuperAdmin) {
          const defaultUsername = "superAdmin";
          const defaultPassword = "super123";
          const defaultRole = "super_admin";
  
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(defaultPassword, salt);
  
            const defaultSuperAdmin = new User({
                username: defaultUsername,
                password: hashedPassword, 
                role: defaultRole,
            });
            await defaultSuperAdmin.save();
            console.log("Default Super Admin created");
        } else {
            console.log("Default Super Admin already exists.");
        }
    } catch (error) {
        console.error("Error creating default Super Admin:", error);
    }
};

// If you want to call this function directly during server startup
const initializeDefaultSuperAdmin = async () => {
    try {
        await createDefaultSuperAdmin();
        console.log("Super admin initialization completed");
    } catch (err) {
        console.error("Failed to initialize super admin:", err.message);
    }
};

module.exports = {
    createDefaultSuperAdmin,
    initializeDefaultSuperAdmin,
};