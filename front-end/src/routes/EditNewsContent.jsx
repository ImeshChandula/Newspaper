import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from 'react-router-dom';

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
    const id = location.state?.articleId;
    if (id) {
      setArticleId(id);
      fetchArticleData(id);
    } else {
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
        headers: { Authorization: `Bearer ${token}` },
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
        navigate("/unauthorized");
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
      setMessage('✅ News article updated successfully!');
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
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 text-white bg-dark">
        <div>Loading article data...</div>
      </div>
    );
  }

  return (
    <div className="container my-5 py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8 col-xl-6 bg-dark text-white p-4 rounded shadow-lg">
          <h2 className="mb-4 text-center border-bottom pb-2">Edit News Article</h2>

          {articleId ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="form-select bg-dark text-white border-secondary"
                >
                  <option value="">Select Category</option>
                  <option value="Education">Education</option>
                  <option value="Politics">Politics</option>
                  <option value="Sports">Sports</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter article title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="form-control bg-dark text-white border-secondary"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Media URL (optional)</label>
                <input
                  type="text"
                  name="media"
                  placeholder="Enter media URL"
                  value={formData.media}
                  onChange={handleChange}
                  className="form-control bg-dark text-white border-secondary"
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Content</label>
                <textarea
                  name="content"
                  placeholder="Enter news content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="form-control bg-dark text-white border-secondary"
                ></textarea>
              </div>

              <div className="d-flex gap-3">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Article'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger w-100"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>

              {message && (
                <div className="alert alert-info mt-4 text-center">{message}</div>
              )}
            </form>
          ) : (
            <div className="text-center">
              <p>{message}</p>
              <button
                onClick={() => navigate('/acceptNewsModeration')}
                className="btn btn-primary mt-3"
              >
                Back to Moderation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

};

export default EditNewsContent;
