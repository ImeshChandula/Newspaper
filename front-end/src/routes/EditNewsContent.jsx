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
  const [mediaError, setMediaError] = useState('');

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // Check if media URL contains blocked social media and file hosting links
  const validateMediaUrl = (url) => {
    if (!url) return true;
    
    const blockedDomains = [
      // Social media platforms
      'facebook.com', 'fb.com', 'fb.me', 'facebook.me',
      'instagram.com', 'instagr.am', 'instagram',
      'tiktok.com', 'tiktok', 'vm.tiktok.com',
      'vimeo.com', 'dailymotion.com', 'dai.ly',
      
      // File hosting services
      'mega.nz', 'mega.io', 'mega.co.nz',
      'mediafire.com', 'mfi.re'
    ];
    
    const lowercaseUrl = url.toLowerCase();
    return !blockedDomains.some(domain => lowercaseUrl.includes(domain));
  };

  // Validate media URL whenever it changes
  useEffect(() => {
    if (formData.media && !validateMediaUrl(formData.media)) {
      setMediaError('Facebook, Instagram, TikTok, Mega, and Mediafire links are not allowed');
    } else {
      setMediaError('');
    }
  }, [formData.media]);

  const fetchArticleData = async (id) => {
    setFetchLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL_NEWS}/getNewsArticleByID/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const article = res.data;

      // Check if the existing media URL is valid
      const mediaUrl = article.media || '';
      const isMediaValid = validateMediaUrl(mediaUrl);

      // Set error message if existing media URL is invalid
      if (!isMediaValid) {
        setMediaError('Facebook, Instagram, TikTok, Mega, and Mediafire links are not allowed');
      }

      setFormData({
        category: article.category || '',
        title: article.title || '',
        media: mediaUrl,
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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear media error when user starts modifying the field
    if (name === 'media') {
      setMediaError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for invalid social media links before submission
    if (!validateMediaUrl(formData.media)) {
      setMediaError('Facebook, Instagram, TikTok, Mega, and Mediafire links are not allowed');
      return; // Prevent form submission
    }

    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL_NEWS}/updateNewsArticleByID/${articleId}`,
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
      <div className="d-flex justify-content-center align-items-center vh-100 text-black bg-white">
        <div>Loading article data...</div>
      </div>
    );
  }

  return (
    <div className="container my-5 pt-5">
      <div className="row justify-content-center mt-5">
        <div className="col-12 col-md-10 col-lg-8 col-xl-6 bg-white text-black p-4 rounded shadow-lg">
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
                  className="form-select bg-white border-secondary"
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
                  className="form-control bg-white border-secondary"
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
                  className={`form-control bg-white border-secondary ${mediaError ? 'is-invalid' : ''}`}
                />
                {mediaError && (
                  <div className="invalid-feedback">
                    {mediaError}
                  </div>
                )}
                <small className="form-text text-muted">
                  Note: Facebook, Instagram, TikTok, Mega, and Mediafire links are not allowed
                </small>
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
                  className="form-control bg-white border-secondary"
                ></textarea>
              </div>

              <div className="d-flex gap-3">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading || mediaError}
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
