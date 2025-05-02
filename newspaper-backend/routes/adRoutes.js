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

// @route   GET api/ads/getAllAds
// @route   GET api/ads/getAllAds?active=true (with filter)
// @desc    Get all ads
// @access  Private: super_admin
router.get("/getAllAds", authenticateUser, authorizeRoles("super_admin"), adsController.getAllAds);

// @route   GET api/ads/getAllActiveAds
// @desc    Get all active ads that haven't expired for frontend display
// @access  Public
router.get("/getAllActiveAds", adsController.getAllActiveAds);

// @route   GET api/ads/getSingleAd/:id
// @desc    Get single ad by adID
// @access  Private: super_admin
router.get("/getSingleAd/:id", authenticateUser, authorizeRoles("super_admin"), adsController.getSingleAd);

// @route   PATCH api/ads/updateAd/:id
// @desc    Update an ad by AdID
// @access  Private: super_admin
router.patch("/updateAd/:id", authenticateUser, authorizeRoles("super_admin"), adsController.updateAd);

// @route   DELETE api/ads/deleteAd/:id
// @desc    Delete an ad by AdID
// @access  Private: super_admin
router.delete("/deleteAd/:id", authenticateUser, authorizeRoles("super_admin"), adsController.deleteAd);

module.exports = router;