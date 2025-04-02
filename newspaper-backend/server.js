const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const connectDB = require("./config/db");
const SuperAdmin = require("./models/SuperAdmin");

dotenv.config();
connectDB();

// Create a default Super Admin
const createDefaultSuperAdmin = async () => {
  try {
      const existingSuperAdmin = await SuperAdmin.findOne({ username: "superAdmin" });
      if (!existingSuperAdmin) {
          const defaultSuperAdmin = new SuperAdmin({
              username: "superAdmin",
              password: "super123", 
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

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);


// Routes
app.use("/api/auth/admin", require("./routes/authRoutes"));
app.use("/api/auth/superAdmin", require("./routes/authRoutesSuper"));


// Default Route 
// http://localhost:5000
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
