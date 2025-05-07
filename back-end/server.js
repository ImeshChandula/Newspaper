const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const { initializeDefaultSuperAdmin } = require("./config/CreateDefaultSuperAdmin");


dotenv.config();
connectDB();

initializeDefaultSuperAdmin().then(() => {
  console.log('Server initialization completed.....\n');
});

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(cookieParser());


// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/news", require("./routes/newsRoutes"));
app.use("/api/ads", require("./routes/adRoutes"));


//  route handler for the root path
app.get('/', (req, res) => {
  res.send('Its Working...!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: "error", message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
