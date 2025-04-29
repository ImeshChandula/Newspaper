import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from 'react-router-dom';
import '../components/css/CreateNewsArticle.css';

const EditNewsContent = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [articleId, setArticleId] = useState('');
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    category: '',
    title: '',
    media: '',
    content: '',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    // Check if we have an article ID from state (passed during navigation)
    const id = location.state?.articleId;
    if (id) {
      setArticleId(id);
      fetchArticleData(id);
    } else {
      // If no ID provided, try to get from URL or localStorage
      const urlParams = new URLSearchParams(location.search);
      const paramId = urlParams.get('id');
      const storedId = localStorage.getItem('editNewsId');
      
      if (paramId) {
        setArticleId(paramId);
        fetchArticleData(paramId);
      } else if (storedId) {
        setArticleId(storedId);
        fetchArticleData(storedId);
      } else {
        setFetchLoading(false);
        setMessage('No article ID found. Please select an article to edit.');
      }
    }
  }, [location]);

  const fetchArticleData = async (id) => {
    setFetchLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/news/getNewsArticleByID/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const article = res.data;
      setFormData({
        category: article.category || '',
        title: article.title || '',
        media: article.media || '',
        content: article.content || '',
      });
    } catch (error) {
      console.error('Error fetching article:', error);
      setMessage('Failed to load article data. Please try again.');
    } finally {
      setFetchLoading(false);
    }
  };

  const goToDashboard = () => {
    if (!user) return;
    switch (user.role) {
      case "editor":
        navigate("/dashboard/editor");
        break;
      case "admin":
        navigate("/dashboard/admin");
        break;
      case "super_admin":
        navigate("/dashboard/super-admin");
        break;
      default:
        // Handle unexpected role or fallback
        navigate("/unauthorized"); // Redirect to home or another appropriate page
         break;
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/news/updateNewsArticleByID/${articleId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setMessage('News article updated successfully!');
      
      // Clear localStorage and redirect after successful update
      setTimeout(() => {
        localStorage.removeItem('editNewsId');
        goToDashboard();
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something went wrong during update.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    localStorage.removeItem('editNewsId');
    goToDashboard();
  };

  if (fetchLoading) {
    return <div className="create_news_container"><p>Loading article data...</p></div>;
  }




  return (
    <div className="create_news_container">
      <h2 className="create_news_header">Edit News Article</h2>
      {articleId ? (
        <form onSubmit={handleSubmit} className="create_news_form">
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="create_news_input_select"
          >
            <option value="">Select Category</option>
            <option value="Education">Education</option>
            <option value="Politics">Politics</option>
            <option value="Sports">Sports</option>
          </select>

          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="create_news_input_text"
          />

          <input
            type="text"
            name="media"
            placeholder="Media URL (optional)"
            value={formData.media}
            onChange={handleChange}
            className="create_news_input_text"
          />

          <textarea
            name="content"
            placeholder="Content"
            value={formData.content}
            onChange={handleChange}
            required
            rows="5"
            className="create_news_input_textarea"
          ></textarea>

          <div className="edit_news_buttons">
            <button
              type="submit"
              className="create_news_submit_button"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Article'}
            </button>
            
            <button
              type="button"
              className="edit_news_cancel_button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="create_news_message">
          <p>{message}</p>
          <button 
            onClick={() => navigate('/acceptNewsModeration')} 
            className="create_news_submit_button"
          >
            Back to Moderation
          </button>
        </div>
      )}

      {message && <p className="create_news_message">{message}</p>}
    </div>
  )
}

export default EditNewsContent