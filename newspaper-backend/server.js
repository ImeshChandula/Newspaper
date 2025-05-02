const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

dotenv.config();
connectDB();

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
          console.log("Default Super Admin created: superAdmin / super123");
      } else {
          console.log("Default Super Admin already exists. superAdmin / super123");
      }
  } catch (error) {
      console.error("Error creating default Super Admin:", error);
  }
};




const app = express();
app.use(express.json());

// Run this function on server start
createDefaultSuperAdmin();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());


// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/news", require("./routes/newsRoutes"));
app.use("/api/ads", require("./routes/adRoutes"));


// Default Route 
// http://localhost:5000
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
