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


//@route   GET /api/news/education/pending
//@desc    Get all pending news articles in Education category, sorted by latest
//@access  Public
const getEducationPendingNews = async (req, res) => {
    try {
        const newsArticles = await News.find({
            category: "Education",
            status: "pending"
        })
        .sort({ date: -1 }) // Descending
        .populate('author', 'username email');

        res.status(200).json(newsArticles);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving news articles', error: error.message });
    }
};


//@route   GET /api/news/education/accept
//@desc    Get all accept news articles in Education category, sorted by latest
//@access  Public
const getEducationAcceptNews = async (req, res) => {
    try {
        const newsArticles = await News.find({
            category: "Education",
            status: "accept"
        })
        .sort({ date: -1 }) // Descending
        .populate('author', 'username email');

        res.status(200).json(newsArticles);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving news articles', error: error.message });
    }
};

//@route   GET /api/news/education/reject
//@desc    Get all reject news articles in Education category, sorted by latest
//@access  Public
const getEducationRejectNews = async (req, res) => {
    try {
        const newsArticles = await News.find({
            category: "Education",
            status: "reject"
        })
        .sort({ date: -1 }) // Descending
        .populate('author', 'username email');

        res.status(200).json(newsArticles);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving news articles', error: error.message });
    }
};


//@route   GET /api/news/politics/pending
//@desc    Get all pending news articles in Politics category, sorted by latest
//@access  Public
const getPoliticsPendingNews = async (req, res) => {
    try {
        const newsArticles = await News.find({
            category: "Politics",
            status: "pending"
        })
        .sort({ date: -1 }) // Descending
        .populate('author', 'username email');

        res.status(200).json(newsArticles);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving news articles', error: error.message });
    }
};


//@route   GET /api/news/politics/accept
//@desc    Get all accept news articles in Politics category, sorted by latest
//@access  Public
const getPoliticsAcceptNews = async (req, res) => {
    try {
        const newsArticles = await News.find({
            category: "Politics",
            status: "accept"
        })
        .sort({ date: -1 }) // Descending
        .populate('author', 'username email');

        res.status(200).json(newsArticles);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving news articles', error: error.message });
    }
};

//@route   GET /api/news/politics/reject
//@desc    Get all reject news articles in Politics category, sorted by latest
//@access  Public
const getPoliticsRejectNews = async (req, res) => {
    try {
        const newsArticles = await News.find({
            category: "Politics",
            status: "reject"
        })
        .sort({ date: -1 }) // Descending
        .populate('author', 'username email');

        res.status(200).json(newsArticles);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving news articles', error: error.message });
    }
};

//@route   GET /api/news/sports/pending
//@desc    Get all pending news articles in Sports category, sorted by latest
//@access  Public
const getSportsPendingNews = async (req, res) => {
    try {
        const newsArticles = await News.find({
            category: "Sports",
            status: "pending"
        })
        .sort({ date: -1 }) // Descending
        .populate('author', 'username email');

        res.status(200).json(newsArticles);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving news articles', error: error.message });
    }
};


//@route   GET /api/news/sports/accept
//@desc    Get all accept news articles in Sports category, sorted by latest
//@access  Public
const getSportsAcceptNews = async (req, res) => {
    try {
        const newsArticles = await News.find({
            category: "Sports",
            status: "accept"
        })
        .sort({ date: -1 }) // Descending
        .populate('author', 'username email');

        res.status(200).json(newsArticles);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving news articles', error: error.message });
    }
};

//@route   GET /api/news/sports/reject
//@desc    Get all reject news articles in Sports category, sorted by latest
//@access  Public
const getSportsRejectNews = async (req, res) => {
    try {
        const newsArticles = await News.find({
            category: "Sports",
            status: "reject"
        })
        .sort({ date: -1 }) // Descending
        .populate('author', 'username email');

        res.status(200).json(newsArticles);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving news articles', error: error.message });
    }
};


//@route   GET /api/news/pending
//@desc    Get all pending news articles
//@access  Admins, Moderators
const getAllPendingNews = async (req, res) => {
    try {
      const pendingNews = await News.find({ status: "pending" })
        .sort({ date: -1 })
        .populate('author', 'username email');
  
      res.status(200).json(pendingNews);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching pending news', error: error.message });
    }
  };
  

//@route   GET /api/news/accept
//@desc    Get all accept news articles
//@access  Admins, Moderators
const getAllAcceptNews = async (req, res) => {
    try {
      const pendingNews = await News.find({ status: "accept" })
        .sort({ date: -1 })
        .populate('author', 'username email');
  
      res.status(200).json(pendingNews);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching accept news', error: error.message });
    }
  };


//@route   GET /api/news/reject
//@desc    Get all reject news articles
//@access  Admins, Moderators
const getAllRejectNews = async (req, res) => {
    try {
      const pendingNews = await News.find({ status: "reject" })
        .sort({ date: -1 })
        .populate('author', 'username email');
  
      res.status(200).json(pendingNews);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching reject news', error: error.message });
    }
  };


//@route   PATCH /api/news/updateStatus/:id
//@desc    Update status of a news article (accept/reject)
//@access  Admins, Moderators
const updateNewsStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    if (!['accept', 'reject'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
  
    try {
      const updatedNews = await News.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
  
      if (!updatedNews) {
        return res.status(404).json({ message: 'News article not found' });
      }
  
      res.status(200).json({ message: `News article ${status}ed successfully`, updatedNews });
    } catch (error) {
      res.status(500).json({ message: 'Error updating status', error: error.message });
    }
  };


// @route   GET /api/news/getNewsArticleByID/:id
// @desc    Get a single news article by ID
// @access  Public
const getNewsArticleByID = async (req, res) => {
    try {
      const newsArticle = await News.findById(req.params.id)
        .populate('author', 'username email');
  
      if (!newsArticle) {
        return res.status(404).json({ message: 'News article not found' });
      }
  
      res.status(200).json(newsArticle);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving news article', error });
    }
  };
  
  // @route   PUT /api/news/updateNewsArticle/:id
  // @desc    Update a news article
  // @access  Admin, Super Admin
  const updateNewsArticleByID = async (req, res) => {
    try {
      const { title, media, content, category } = req.body;
  
      const updatedNews = await News.findByIdAndUpdate(
        req.params.id,
        { title, media, content, category },
        { new: true }
      );
  
      if (!updatedNews) {
        return res.status(404).json({ message: 'News article not found' });
      }
  
      res.status(200).json({
        message: 'News article updated successfully',
        newsArticle: updatedNews
      });
    } catch (error) {
      res.status(500).json({ message: 'Error updating news article', error });
    }
  };
  
  // @route   DELETE /api/news/deleteNewsArticle/:id
  // @desc    Delete a news article
  // @access  Admin, Super Admin
  const deleteNewsArticleByID = async (req, res) => {
    try {
      const deletedNews = await News.findByIdAndDelete(req.params.id);
  
      if (!deletedNews) {
        return res.status(404).json({ message: 'News article not found' });
      }
  
      res.status(200).json({ message: 'News article deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting news article', error });
    }
  };




module.exports = {
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
};