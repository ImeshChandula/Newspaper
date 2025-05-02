const express = require('express');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware');
const adsController = require("../controllers/adsController");

const router = express.Router();

// Routes
// http://localhost:5000/api/ads

// @route   POST api/ads/createAd
// @desc    Create new advertisement
// @access  Private: super_admin
router.post("/createAd", authenticateUser, authorizeRoles("super_admin"), adsController.createAd);

// @route   POST api/ads/createAd
// @desc    Get all ads
// @access  Private: super_admin
router.get("/getAllAds", authenticateUser, authorizeRoles("super_admin"), adsController.getAllAds);

module.exports = router;