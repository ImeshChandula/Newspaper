import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../components/css/CreateNewsArticle.css';

const CreateNewsArticle = () => {

  const [formData, setFormData] = useState({
    category: '',
    title: '',
    media: '',
    content: '',
    breakingNews: false,
    foreignNews: false,
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [mediaError, setMediaError] = useState('');

  // Check if media URL contains blocked social media links
  const validateMediaUrl = (url) => {
    if (!url) return true;
    
    const blockedDomains = [
      // Social media platforms
      'facebook.com', 'fb.com', 'fb.me', 'facebook.me',
      'instagram.com', 'instagr.am', 'instagram',
      'tiktok.com', 'tiktok', 'vm.tiktok.com',
      
      // File hosting services
      'mega.nz', 'mega.io', 'mega.co.nz',
      'mediafire.com', 'mfi.re'
    ];
    
    const lowercaseUrl = url.toLowerCase();
    return !blockedDomains.some(domain => lowercaseUrl.includes(domain));
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData({
      ...formData,
      [name]: newValue
    });

    // Clear media error when user starts modifying the field
    if (name === 'media') {
      setMediaError('');
    }

  };


  // Validate media URL whenever it changes
  useEffect(() => {
    if (formData.media && !validateMediaUrl(formData.media)) {
      setMediaError('Facebook, Instagram, TikTok, Mega, and Mediafire links are not allowed');
    } else {
      setMediaError('');
    }
  }, [formData.media]);



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
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL_NEWS}/createNewsArticle`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log("News article created successfully!");
      setMessage('News Article Created Successfully.');
      setFormData({ category: '', title: '', media: '', content: '', breakingNews: false });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something Went Wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8 col-xl-6 bg-white text-black p-4 rounded shadow-lg border border-secondary">
          <h2 className="text-center mb-4 border-bottom pb-2 text-black fw-bold">Create News Article</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="form-select text-black border-secondary"
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
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                required
                className="form-control bg-white text-black border-secondary"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Media URL (optional)</label>
              <input
                type="text"
                name="media"
                placeholder="Ex: Google Drive link / YouTube link / Google Image,Video link"
                value={formData.media}
                onChange={handleChange}
                className={`form-control bg-white text-black border-secondary ${mediaError ? 'is-invalid' : ''}`}
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
                placeholder="Content"
                value={formData.content}
                onChange={handleChange}
                required
                rows="5"
                className="form-control bg-white text-black border-secondary"
              ></textarea>
            </div>

            <div className="mb-3 form-check">
              <input
                type="checkbox"
                name="breakingNews"
                id="breakingNews"
                checked={formData.breakingNews}
                onChange={handleChange}
                className="form-check-input"
              />
              <label className="form-check-label" htmlFor="breakingNews">
                Mark as Breaking News
              </label>
            </div>

            <div className="mb-3 form-check">
              <input
                type="checkbox"
                name="foreignNews"
                id="foreignNews"
                checked={formData.foreignNews}
                onChange={handleChange}
                className="form-check-input"
              />
              <label className="form-check-label" htmlFor="foreignNews">
                Mark as Foreign News
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading || mediaError}
            >
              {loading ? 'Creating...' : 'Create News'}
            </button>
          </form>

          {message && (
            <div className="alert alert-info mt-4 text-center">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );

};

export default CreateNewsArticle;
