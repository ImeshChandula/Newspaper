const News = require("../models/News");


//@route   POST /api/news/createNewsArticle
//@desc    Create a news article
//@access  Editor, Admin
const createNewsArticle = async (req, res) => {
    try {
        const { category, title, media, content, breakingNews, foreignNews } = req.body;

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
            foreignNews: Boolean(foreignNews) || false,
            author: req.user.id, 
        });

        await newsArticle.save();

        res.status(201).json({ message: 'News article created successfully', newsArticle });
    } catch (error) {
        res.status(500).json({ message: 'Error creating news', error: error.message });
    }
};
 

//@route   GET /api/news/myArticles
//@desc    Get all news articles created by the logged-in editor
//@access  Editor, Admin
const getMyNewsArticles = async (req, res) => {
  try {
    await News.updateBreakingNews();

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



//@route   GET /api/news/education/accept
//@desc    Get all accept news articles in Education category, sorted by latest
//@access  Public
const getEducationAcceptNews = async (req, res) => {
    try {
        await News.updateBreakingNews();

        const query = {
          breakingNews: false,
          foreignNews: false,
          category: "Education",
          status: "accept"
        };

        const newsArticles = await News.find(query).sort({ date: -1 }).populate('author', 'username email');

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

        const query = {
          breakingNews: false,
          foreignNews: false,
          category: "Politics",
          status: "accept"
        };
        const newsArticles = await News.find(query).sort({ date: -1 }).populate('author', 'username email');

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

        const query = {
          breakingNews: false,
          foreignNews: false,
          category: "Sports",
          status: "accept"
        };

        const newsArticles = await News.find(query).sort({ date: -1 }).populate('author', 'username email');

        res.status(200).json(newsArticles);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving news articles', error: error.message });
    }
};

//Newly added categories (local, other, article)

//@route   GET /api/news/local/accept
//@desc    Get all accept news articles in Local category, sorted by latest
//@access  Public
const getLocalAcceptNews = async (req, res) => {
    try {
        await News.updateBreakingNews();

        const query = {
          breakingNews: false,
          foreignNews: false,
          category: "Local",
          status: "accept"
        };

        const newsArticles = await News.find(query).sort({ date: -1 }).populate('author', 'username email');

        res.status(200).json(newsArticles);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving news articles', error: error.message });
    }
};


//@route   GET /api/news/other/accept
//@desc    Get all accept news articles in Other category, sorted by latest
//@access  Public
const getOtherAcceptNews = async (req, res) => {
    try {
        await News.updateBreakingNews();

        const query = {
          breakingNews: false,
          foreignNews: false,
          category: "Other",
          status: "accept"
        };

        const newsArticles = await News.find(query).sort({ date: -1 }).populate('author', 'username email');

        res.status(200).json(newsArticles);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving news articles', error: error.message });
    }
};


//@route   GET /api/news/article/accept
//@desc    Get all accept news articles in Article category, sorted by latest
//@access  Public
const getArticleAcceptNews = async (req, res) => {
    try {
        await News.updateBreakingNews();

        const query = {
          breakingNews: false,
          foreignNews: false,
          category: "Article",
          status: "accept"
        };

        const newsArticles = await News.find(query).sort({ date: -1 }).populate('author', 'username email');

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

      const query = {
          foreignNews: false,
          breakingNews: true,
          status: "accept"
      };

      const breakingNews = await News.find(query).sort({ date: -1 }).populate('author', 'username email');
      
      res.status(200).json(breakingNews);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching breaking news', error: error.message });
  }
};

// @route   PATCH /api/news/toggleBreakingNews/:id
// @desc    Toggle breaking news status
// @access  Admins
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
      await News.updateBreakingNews();

      const { foreignNews, breakingNews, category  } = req.query;
      
      const query = { 
        status: "pending" 
      };

      // Add foreignNews filter if provided in the query parameters
      if (foreignNews !== undefined) {
        query.foreignNews = foreignNews === "true";
      }

      // Add breakingNews filter if provided in the query parameters
      if (breakingNews !== undefined) {
        query.breakingNews = breakingNews === "true";
      }

      // Add category filter if provided in the query parameters
      if (category) {
        query.category = category;
      }

      const pendingNews = await News.find(query)
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
      await News.updateBreakingNews();

      const { foreignNews, breakingNews, category } = req.query;

      const query = { 
        status: "accept" 
      };

      // Add foreignNews filter if provided in the query parameters
      if (foreignNews !== undefined) {
        query.foreignNews = foreignNews === "true";
      }

      // Add breakingNews filter if provided in the query parameters
      if (breakingNews !== undefined) {
        query.breakingNews = breakingNews === "true";
      }

      // Add category filter if provided in the query parameters
      if (category) {
        query.category = category;
      }

      const acceptNews = await News.find(query).sort({ date: -1 }).populate('author', 'username email');
  
      res.status(200).json(acceptNews);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching accept news', error: error.message });
    }
};


//@route   GET /api/news/reject
//@desc    Get all reject news articles
//@access  Admins, Moderators
const getAllRejectNews = async (req, res) => {
    try {
      await News.updateBreakingNews();

      const { foreignNews, breakingNews, category } = req.query;
      
      const query = { 
        status: "reject" 
      };

      // Add foreignNews filter if provided in the query parameters
      if (foreignNews !== undefined) {
        query.foreignNews = foreignNews === "true";
      }

      // Add breakingNews filter if provided in the query parameters
      if (breakingNews !== undefined) {
        query.breakingNews = breakingNews === "true";
      }

      // Add category filter if provided in the query parameters
      if (category) {
        query.category = category;
      }

      const rejectNews = await News.find(query)
        .sort({ date: -1 })
        .populate('author', 'username email');
  
      res.status(200).json(rejectNews);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching reject news', error: error.message });
    }
  };


//@route   GET /api/news/getAllRecentlyNewsWithoutBreakingNews
//@desc    Get all Recently Accept News Without BreakingNews
//@access  public
const getAllRecentlyNewsWithoutBreakingNews = async (req, res) => {
  try {
    await News.updateBreakingNews();

    const query = {
      status: "accept", 
      breakingNews: false,
      foreignNews: false
    };
    const pendingNews = await News.find(query)
      .sort({ date: -1 })
      .populate('author', 'username email');

    res.status(200).json(pendingNews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching accept news', error: error.message });
  }
};

//@route   GET /api/news/getForeignNewsAccept
//@desc    Get all Accept Foreign News Without BreakingNews
//@access  public
const getForeignNewsAccept = async (req, res) => {
  try {
    await News.updateBreakingNews();

    const query = {
      status: "accept", 
      breakingNews: false,
      foreignNews: true
    };
    const pendingNews = await News.find(query)
      .sort({ date: -1 })
      .populate('author', 'username email');

    res.status(200).json(pendingNews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching accept news', error: error.message });
  }
};

// @route   PATCH /api/news/toggleForeignNews/:id
// @desc    Toggle breaking news status
// @access  Admins
const toggleForeignNews = async (req, res) => {
  try {
      const { id } = req.params;
      const { foreignNews } = req.body;

      // Check if news article exists
      const newsArticle = await News.findById(id);
      if (!newsArticle) {
          return res.status(404).json({ message: 'News article not found' });
      }

      // Update foreign news status
      newsArticle.foreignNews = foreignNews;
      await newsArticle.save();

      res.status(200).json({ 
          message: `Article successfully ${foreignNews ? 'marked as' : 'unmarked from'} foreign news`,
          newsArticle 
      });
  } catch (error) {
      console.error('Error toggling foreign news status:', error);
      res.status(500).json({ message: 'Error updating foreign news status', error: error.message });
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
        foreignNews: req.body.foreignNews !== undefined ? req.body.foreignNews : news.foreignNews,
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
    getEducationAcceptNews,
    getPoliticsAcceptNews,
    getSportsAcceptNews,
    getLocalAcceptNews,      // New export
    getOtherAcceptNews,      // New export
    getArticleAcceptNews,    // New export
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
    getAllRecentlyNewsWithoutBreakingNews,
    getForeignNewsAccept,
    toggleForeignNews,
};