const express = require('express');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware');
const {
    createNewsArticle,
    getAllNews,
    getNewsArticleByID,
    updateNewsArticle,
    deleteNewsArticle,
} = require("../controllers/newsController");


const router = express.Router();

// Routes
// http://localhost:5000/api/news"
router.get("/getAllNews", getAllNews);
router.get("/getNewsArticleByID:id", getNewsArticleByID);
router.post("/createNewsArticle", authenticateUser, authorizeRoles("editor", "admin"), createNewsArticle);
router.post("/updateNewsArticle:id", authenticateUser, authorizeRoles("super_admin", "admin"), updateNewsArticle);
router.post("/deleteNewsArticle:id", authenticateUser, authorizeRoles("super_admin", "admin"), deleteNewsArticle);


module.exports = router;