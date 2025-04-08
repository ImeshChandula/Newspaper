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
    updateNewsArticle,
    deleteNewsArticle,
} = require("../controllers/newsController");


const router = express.Router();

// Routes
// http://localhost:5000/api/news"
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
router.get("/pending",authenticateUser, authorizeRoles("super_admin", "admin"), getAllPendingNews);
router.get("/reject",authenticateUser, authorizeRoles("super_admin", "admin"), getAllRejectNews);
router.patch("/updateStatus/:id", authenticateUser, authorizeRoles("super_admin", "admin"), updateNewsStatus);

router.get("/getNewsArticleByID/:id", getNewsArticleByID);
router.post("/createNewsArticle", authenticateUser, authorizeRoles("editor", "admin"), createNewsArticle);
router.post("/updateNewsArticle/:id", authenticateUser, authorizeRoles("super_admin", "admin"), updateNewsArticle);
router.post("/deleteNewsArticle/:id", authenticateUser, authorizeRoles("super_admin", "admin"), deleteNewsArticle);


module.exports = router;