const User = require("../models/User");
const bcrypt = require("bcryptjs");
require('dotenv').config();


// Create a default Super Admin
const createDefaultSuperAdmin = async () => {
    try {
        const defaultUsername = process.env.SUPER_ADMIN_USERNAME || "Super Admin";
        const defaultEmail = process.env.SUPER_ADMIN_EMAIL || "superadmin@test.lk";
        const defaultPassword = process.env.SUPER_ADMIN_PASSWORD || "super@123";
        const defaultRole = "super_admin";

        const existingSuperAdmin = await User.findOne({ email: defaultEmail });
        if (!existingSuperAdmin) {
          
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(defaultPassword, salt);
  
            const defaultSuperAdmin = new User({
                username: defaultUsername,
                email: defaultEmail,
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