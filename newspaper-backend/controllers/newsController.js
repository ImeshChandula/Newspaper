const News = require("../models/newsModel");


//@route   POST /api/news/createNewsArticle
//@desc    Create a news article
//@access  Editor, Admin
const createNewsArticle = async (req, res) => {
    try {
        const { category, title, media, content } = req.body;

        // Basic input validation (optional but recommended)
        if (!category || !title || !content) {
            return res.status(400).json({ message: 'Category, title, and content are required.' });
        }

        const newsArticle = new News({
            category,
            title,
            media,
            content,
            author: req.user.id, // middleware that sets req.user
            // status defaults to "pending", so no need to manually add it unless overriding
        });

        await newsArticle.save();

        res.status(201).json({ message: 'News article created successfully', newsArticle });
    } catch (error) {
        res.status(500).json({ message: 'Error creating news', error: error.message });
    }
};


//@route   GET /api/news/getAllNews
//@desc    Get all news articles
//@access  Public
const getAllNews = async (req, res) => {
    try {
        const newsArticles = await News.find().populate('author', 'username email');
        res.status(200).json(newsArticles);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving news articles', error });
    }
};


//@route   GET /api/news/getNewsArticleByID/:id
//@desc    Get a single news article by ID
//@access  Public
const getNewsArticleByID = async (req, res) => {
    try {
        const newsArticle = await News.findById(req.params.id).populate('author', 'username email');
        if (!newsArticle) {
            return res.status(404).json({ message: 'News article not found' });
        }
        res.status(200).json(newsArticle);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving news article', error });
    }
};


//@route   PUT /api/news/updateNewsArticle/:id
//@desc    Update a news article
//@access  Admin, Super Admin
const updateNewsArticle = async (req, res) => {
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
};


//@route   DELETE /api/news/deleteNewsArticle/:id
//@desc    Delete a news article
//@access  Admin, Super Admin
const deleteNewsArticle = async (req, res) => {
    try {
        const newsArticle = await News.findByIdAndDelete(req.params.id);

        if (!newsArticle) {
            return res.status(404).json({ message: 'News article not found' });
        }

        res.status(200).json({ message: 'News article deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting news article', error });
    }
};




module.exports = {
    createNewsArticle,
    getAllNews,
    getNewsArticleByID,
    updateNewsArticle,
    deleteNewsArticle,
};