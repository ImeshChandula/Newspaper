const News = require("../models/News");


//@route   POST /api/news/createNewsArticle
//@desc    Create a news article
//@access  Editor, Admin
const createNewsArticle = async (req, res) => {
    try {
        const { category, title, media, content, breakingNews } = req.body;

        // Basic input validation (optional but recommended)
        if (!category || !title || !content) {
            return res.status(400).json({ message: 'Category, title, and content are required.' });
        }

        const newsArticle = new News({
            category,
            title,
            media: media || '',
            content,
            breakingNews: Boolean(breakingNews) || false,
            author: req.user.id, // middleware that sets req.user
            // status defaults to "pending", so no need to manually add it unless overriding
        });

        await newsArticle.save();

        res.status(201).json({ message: 'News article created successfully', newsArticle });
    } catch (error) {
        res.status(500).json({ message: 'Error creating news', error: error.message });
    }
};


//@route   GET /api/news/my-articles
//@desc    Get all news articles created by the logged-in editor
//@access  Editor, Admin
const getMyNewsArticles = async (req, res) => {
  try {
      // Get the logged-in user's ID from the authentication middleware
      const editorId = req.user.id;
      
      // Find all news articles where author matches the editor's ID
      const query = {
        author: editorId,
      };
      const myArticles = await News.find(query)
          .sort({ date: -1 }) 
          .populate('author', 'username email'); 
      
      res.status(200).json(myArticles);
  } catch (error) {
      res.status(500).json({ 
          message: 'Error retrieving your news articles', 
          error: error.message 
      });
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
        await News.updateBreakingNews();

        const newsArticles = await News.find({
            breakingNews: false,
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
        await News.updateBreakingNews();

        const newsArticles = await News.find({
            breakingNews: false,
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
        await News.updateBreakingNews();

        const newsArticles = await News.find({
            breakingNews: false,
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


//@route   GET /api/news/breaking
//@desc    Get all breaking news from the last 24 hours
//@access  Public
const getBreakingNews = async (req, res) => {
  try {
      // Manually update all expired breaking news
      await News.updateBreakingNews();

      // Query for breaking news articles created in the last 24 hours
      const breakingNews = await News.find({ 
          breakingNews: true,
          status: "accept", 
          date: { $gte: twentyFourHoursAgo }
      })
      .sort({ date: -1 }) // Sort by newest first
      .populate('author', 'username email');
      
      res.status(200).json(breakingNews);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching breaking news', error: error.message });
  }
};

// @route   PATCH /api/news/toggleBreakingNews/:id
// @desc    Toggle breaking news status
// @access  Editor, Admin
const toggleBreakingNews = async (req, res) => {
  try {
      const { id } = req.params;
      const { breakingNews } = req.body;

      // Check if news article exists
      const newsArticle = await News.findById(id);
      if (!newsArticle) {
          return res.status(404).json({ message: 'News article not found' });
      }

      // Update breaking news status
      newsArticle.breakingNews = breakingNews;
      
      // If setting to breaking news, update the date to reset the 24-hour timer
      if (breakingNews) {
          newsArticle.date = new Date();
      }
      
      await newsArticle.save();

      res.status(200).json({ 
          message: `Article successfully ${breakingNews ? 'marked as' : 'unmarked from'} breaking news`,
          newsArticle 
      });
  } catch (error) {
      console.error('Error toggling breaking news status:', error);
      res.status(500).json({ message: 'Error updating breaking news status', error: error.message });
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
      const news = News.findById(req.params.id);

      if (!news) {
        return res.status(404).json({ message: 'News article not found' });
      }

      const updateNewsData = {
        title: req.body.title || news.title,
        media: req.body.media || news.media,
        content: req.body.content || news.content,
        category: req.body.category || news.category,
        breakingNews: req.body.breakingNews !== undefined ? req.body.breakingNews : news.breakingNews,
      };
  
      const updatedNews = await News.findByIdAndUpdate(
        req.params.id,
        updateNewsData,
        { new: true }
      );
  
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
    getMyNewsArticles,
    getBreakingNews,
    toggleBreakingNews
};