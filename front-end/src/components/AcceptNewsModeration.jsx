import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../components/css/PendingNewsModeration.css';

const AcceptNewsModeration = () => {

  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchNews = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get('http://localhost:5000/api/news/accept', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("API Response:", res.data); 
      setNews(res.data);
    } catch (error) {
      console.error('Error fetching Accept news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    console.log("Accept news loaded:", news);
  }, [news]);

  const updateStatus = async (id, status) => {
    try {
      setActionLoading(id);
      const token = localStorage.getItem("token");
      await axios.patch(`http://localhost:5000/api/news/updateStatus/${id}`, 
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setNews(news.filter(article => article._id !== id));
    } catch (error) {
      console.error(`Failed to ${status} article:`, error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditNews = (articleId) => {
    // Store the ID in localStorage as a fallback
    localStorage.setItem("editNewsId", articleId);
    
    // Navigate to the edit page with the article ID in state
    navigate('/editNews', { state: { articleId } });
  };




  return (
    <div className="news_card_container">
      <h2 className="news_head">Accept News Moderation</h2>
      {loading ? (
        <p className="news_text">Loading...</p>
      ) : news.length === 0 ? (
        <p className="news_text">No accept articles to review.</p>
      ) : (
        <div className="news_card_">
          {news.map((article) => (
            <div key={article._id} className="news">
              <div className="news_sub">
                <span className="news_span_1">{article.category}</span>
                <span className="news_span_2">
                  {new Date(article.date).toLocaleString()}
                </span>
              </div>
              <h3 className="news_title">{article.title}</h3>
              {article.media && (
                <img src={article.media} alt="media" className="news_media" />
              )}
              <p className="news_content">{article.content.slice(0, 150)}...</p>
              <p className="news_author">By: {article.author?.username} ({article.author?.email})</p>

              <div className="news_buttons">
                <button 
                  onClick={() => handleEditNews(article._id)} 
                  className="news_edit_button"
                >
                  Edit content
                </button>
                <button
                  onClick={() => updateStatus(article._id, 'reject')}
                  className="news_reject_button"
                  disabled={actionLoading === article._id}
                >
                  {actionLoading === article._id ? 'Stop news showing...' : 'Stop Showing'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AcceptNewsModeration