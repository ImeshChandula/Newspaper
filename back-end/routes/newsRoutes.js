const express = require('express');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware');
const {
    createNewsArticle,
    getEducationPendingNews,
    getEducationAcceptNews,
    getEducationRejectNews,
    getPoliticsAcceptNews,
    getPoliticsPendingNews,
    getPoliticsRejectNews,
    getSportsAcceptNews,
    getSportsPendingNews,
    getSportsRejectNews,
    getAllPendingNews,
    getAllAcceptNews,
    getAllRejectNews,
    updateNewsStatus,
    getNewsArticleByID,
    updateNewsArticleByID,
    deleteNewsArticleByID,
    getMyNewsArticles,
    getBreakingNews,
    toggleBreakingNews,
    getAllRecentlyNewsWithoutBreakingNews
} = require("../controllers/newsController");


const router = express.Router();

// Routes
// http://localhost:5000/api/news
router.get("/education/accept", getEducationAcceptNews);
router.get("/education/pending",authenticateUser, authorizeRoles("super_admin", "admin"), getEducationPendingNews);
router.get("/education/reject",authenticateUser, authorizeRoles("super_admin", "admin"), getEducationRejectNews);

router.get("/politics/accept", getPoliticsAcceptNews);
router.get("/politics/pending",authenticateUser, authorizeRoles("super_admin", "admin"), getSportsPendingNews);
router.get("/politics/reject",authenticateUser, authorizeRoles("super_admin", "admin"), getPoliticsRejectNews);

router.get("/sports/accept", getSportsAcceptNews);
router.get("/sports/pending",authenticateUser, authorizeRoles("super_admin", "admin"), getPoliticsPendingNews);
router.get("/sports/reject",authenticateUser, authorizeRoles("super_admin", "admin"), getSportsRejectNews);

router.get('/accept', getAllAcceptNews);
router.get('/breakingNews', getBreakingNews);
router.get("/pending",authenticateUser, authorizeRoles("super_admin", "admin"), getAllPendingNews);
router.get("/reject",authenticateUser, authorizeRoles("super_admin", "admin"), getAllRejectNews);
router.patch("/updateStatus/:id", authenticateUser, authorizeRoles("super_admin", "admin"), updateNewsStatus);

router.post("/createNewsArticle", authenticateUser, authorizeRoles("editor", "admin", "super_admin"), createNewsArticle);
router.get("/myArticles", authenticateUser, authorizeRoles("editor", "admin", "super_admin"), getMyNewsArticles);

router.get("/getNewsArticleByID/:id", getNewsArticleByID);
router.patch("/updateNewsArticleByID/:id", authenticateUser, authorizeRoles("super_admin", "admin"), updateNewsArticleByID);
router.delete("/deleteNewsArticleByID/:id", authenticateUser, authorizeRoles("super_admin"), deleteNewsArticleByID);

router.patch("/toggleBreakingNews/:id", authenticateUser, authorizeRoles("super_admin", "admin"), toggleBreakingNews);
router.get("/getAllRecentlyNewsWithoutBreakingNews", getAllRecentlyNewsWithoutBreakingNews)

module.exports = router;