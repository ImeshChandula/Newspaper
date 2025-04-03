const express = require('express');
const News = require('../models/newsModel');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   POST /api/news
 * @desc    Create a news article
 * @access  Reporter, Admin, Super Admin
 */
router.post('/', verifyToken, checkRole(['superAdmin', 'Admin', 'reporter']), async (req, res) => {
    try {
        const { title, media, content } = req.body;
        const newsArticle = new News({
            title,
            media,
            content,
            author: req.user.id
        });
        await newsArticle.save();
        res.status(201).json({ message: 'News article created successfully', newsArticle });
    } catch (error) {
        res.status(500).json({ message: 'Error creating news', error });
    }
});

/**
 * @route   GET /api/news
 * @desc    Get all news articles
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        const newsArticles = await News.find().populate('author', 'username email');
        res.status(200).json(newsArticles);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving news articles', error });
    }
});

/**
 * @route   GET /api/news/:id
 * @desc    Get a single news article by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
    try {
        const newsArticle = await News.findById(req.params.id).populate('author', 'username email');
        if (!newsArticle) {
            return res.status(404).json({ message: 'News article not found' });
        }
        res.status(200).json(newsArticle);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving news article', error });
    }
});

/**
 * @route   PUT /api/news/:id
 * @desc    Update a news article
 * @access  Admin, Super Admin
 */
router.put('/:id', verifyToken, checkRole(['superAdmin', 'Admin']), async (req, res) => {
    try {
        const { title, media, content } = req.body;
        const newsArticle = await News.findByIdAndUpdate(
            req.params.id,
            { title, media, content },
            { new: true }
        );

        if (!newsArticle) {
            return res.status(404).json({ message: 'News article not found' });
        }

        res.status(200).json({ message: 'News article updated successfully', newsArticle });
    } catch (error) {
        res.status(500).json({ message: 'Error updating news article', error });
    }
});

/**
 * @route   DELETE /api/news/:id
 * @desc    Delete a news article
 * @access  Admin, Super Admin
 */
router.delete('/:id', verifyToken, checkRole(['superAdmin', 'Admin']), async (req, res) => {
    try {
        const newsArticle = await News.findByIdAndDelete(req.params.id);

        if (!newsArticle) {
            return res.status(404).json({ message: 'News article not found' });
        }

        res.status(200).json({ message: 'News article deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting news article', error });
    }
});

module.exports = router;
// This code defines the routes for managing news articles in a newspaper application.
// It includes routes for creating, retrieving, updating, and deleting news articles.