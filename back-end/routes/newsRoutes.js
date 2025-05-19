const express = require('express');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware');
const newsController = require("../controllers/newsController");


const router = express.Router();

// Routes
// http://localhost:5000/api/news
router.get('/breakingNews', newsController.getBreakingNews);
router.get("/getAllRecentlyNewsWithoutBreakingNews", newsController.getAllRecentlyNewsWithoutBreakingNews);
router.get("/education/accept", newsController.getEducationAcceptNews);
router.get("/politics/accept", newsController.getPoliticsAcceptNews);
router.get("/sports/accept", newsController.getSportsAcceptNews);
router.get("/local/accept", newsController.getLocalAcceptNews);
router.get("/other/accept", newsController.getOtherAcceptNews);
router.get("/article/accept", newsController.getArticleAcceptNews);
router.get("/getNewsArticleByID/:id", newsController.getNewsArticleByID);
router.get("/getForeignNewsAccept", newsController.getForeignNewsAccept);

router.get('/accept', authenticateUser, authorizeRoles("super_admin", "admin"), newsController.getAllAcceptNews);
router.get("/pending",authenticateUser, authorizeRoles("super_admin", "admin"), newsController.getAllPendingNews);
router.get("/reject",authenticateUser, authorizeRoles("super_admin", "admin"), newsController.getAllRejectNews);

router.get("/myArticles", authenticateUser, newsController.getMyNewsArticles);

router.post("/createNewsArticle", authenticateUser, newsController.createNewsArticle);
router.patch("/updateStatus/:id", authenticateUser, authorizeRoles("super_admin", "admin"), newsController.updateNewsStatus);
router.patch("/updateNewsArticleByID/:id", authenticateUser, authorizeRoles("super_admin", "admin"), newsController.updateNewsArticleByID);
router.delete("/deleteNewsArticleByID/:id", authenticateUser, authorizeRoles("super_admin"), newsController.deleteNewsArticleByID);
router.patch("/toggleBreakingNews/:id", authenticateUser, authorizeRoles("super_admin", "admin"), newsController.toggleBreakingNews);
router.patch("/toggleForeignNews/:id", authenticateUser, authorizeRoles("super_admin", "admin"), newsController.toggleForeignNews);


module.exports = router;