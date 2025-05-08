import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../components/css/NewsModeration.css';
import Modal from 'react-bootstrap/Modal';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import 'bootstrap/dist/css/bootstrap.min.css';

const PendingNewsModeration = () => {

  const navigate = useNavigate();

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // State for toasts
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  // Image preview modal state
  const [showImageModal, setShowImageModal] = useState(false);
  //const [previewImage, setPreviewImage] = useState("");

  // Content preview modal state
  const [showContentModal, setShowContentModal] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const [breakingNewsToggleLoading, setBreakingNewsToggleLoading] = useState(null);
  const [foreignNewsToggleLoading, setForeignNewsToggleLoading] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    breakingNews: false,
    foreignNews: false,
    localNews: false,
    categories: []
  });

  // Available categories
  const availableCategories = ['Sports', 'Education', 'Politics'];

  // Handle filter changes
  const handleFilterChange = (type, value) => {
    if (type === 'category') {
      setFilters(prev => {
        const updatedCategories = prev.categories.includes(value)
          ? prev.categories.filter(cat => cat !== value)
          : [...prev.categories, value];
        
        return { ...prev, categories: updatedCategories };
      });
    } else {
      setFilters(prev => ({ ...prev, [type]: value }));
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      breakingNews: false,
      foreignNews: false,
      localNews: false,
      categories: []
    });
  };


  const fetchPendingNews = async () => {
    try {
      const token = localStorage.getItem("token");

      const queryParams = new URLSearchParams();
      if (filters.breakingNews) queryParams.append('breakingNews', 'true');
      if (filters.foreignNews) queryParams.append('foreignNews', 'true');
      if (filters.localNews) queryParams.append('foreignNews', 'false');
      filters.categories.forEach(cat => queryParams.append('category', cat));
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL_NEWS}/pending?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

      console.log("API Response:", res.data);
      setNews(res.data);
    } catch (error) {
      console.error('Error fetching Pending news:', error);
      showNotification("Failed to load pending news articles", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    console.log("Pending news loaded:", news);
  }, [news]);

  const updateStatus = async (id, status) => {
    try {
      setActionLoading(id);
      const token = localStorage.getItem("token");
      await axios.patch(`${process.env.REACT_APP_API_BASE_URL_NEWS}/updateStatus/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setNews((prev) => prev.filter((article) => article._id !== id));
      showNotification(`Article has been ${status === 'accept' ? 'accepted' : 'rejected'}`, "success");
    } catch (error) {
      console.error(`Failed to ${status} article:`, error);
      showNotification(`Failed to ${status} article`, "danger");
    } finally {
      setActionLoading(null);
    }
  };

  const toggleBreakingNews = async (id, currentStatus) => {
    setBreakingNewsToggleLoading(id);
    try {
      const token = localStorage.getItem('token');
      // eslint-disable-next-line no-unused-vars
      const response = await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL_NEWS}/toggleBreakingNews/${id}`,
        { breakingNews: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the news state with the updated article
      setNews((prev) =>
        prev.map((article) =>
          article._id === id ? { ...article, breakingNews: !currentStatus } : article
        )
      );

      showNotification(
        `Article ${!currentStatus ? 'marked as breaking news' : 'unmarked as breaking news'}`,
        'success'
      );
    } catch (error) {
      console.error('Failed to toggle breaking news status:', error);
      showNotification('Failed to update breaking news status', 'danger');
    } finally {
      setBreakingNewsToggleLoading(null);
    }
  };

  const toggleForeignNews = async (id, currentStatus) => {
    setForeignNewsToggleLoading(id);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL_NEWS}/toggleForeignNews/${id}`,
        { foreignNews: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNews((prev) =>
        prev.map((article) =>
          article._id === id ? { ...article, foreignNews: !currentStatus } : article
        )
      );

      showNotification(
        `Article ${!currentStatus ? 'marked as foreign news' : 'unmarked as foreign news'}`,
        'success'
      );
    } catch (error) {
      console.error('Failed to toggle foreign news status:', error);
      showNotification('Failed to update foreign news status', 'danger');
    } finally {
      setForeignNewsToggleLoading(null);
    }
  };

  const handleEditNews = (articleId) => {
    // Store the ID in localStorage as a fallback
    localStorage.setItem("editNewsId", articleId);

    // Navigate to the edit page with the article ID in state
    navigate('/editNews', { state: { articleId } });
  };

  // Helper function to show toast notifications
  const showNotification = (message, variant) => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  const [previewType, setPreviewType] = useState('image'); // 'image' or 'video'
  const [previewUrl, setPreviewUrl] = useState('');

  const handleMediaClick = (mediaUrl) => {
    // Check if it's a YouTube URL
    if (mediaUrl && (
      mediaUrl.includes('youtube.com') || 
      mediaUrl.includes('youtu.be')
    )) {
      setPreviewType('video');
      // Extract video ID from YouTube URL
      let videoId = '';
      
      if (mediaUrl.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(new URL(mediaUrl).search);
        videoId = urlParams.get('v');
      } else if (mediaUrl.includes('youtu.be/')) {
        videoId = mediaUrl.split('youtu.be/')[1].split('?')[0];
      }
      
      if (videoId) {
        setPreviewUrl(`https://www.youtube.com/embed/${videoId}`);
        setShowImageModal(true);
      }
    } else {
      // It's a regular image
      setPreviewType('image');
      setPreviewUrl(mediaUrl);
      setShowImageModal(true);
    }
  };

  const handleContentClick = (title, content) => {
    setPreviewTitle(title);
    setPreviewContent(content);
    setShowContentModal(true);
  };

  // Calculate time remaining for breaking news
  const getBreakingNewsTimeRemaining = (date) => {
    const articleDate = new Date(date);
    const expiryDate = new Date(articleDate.getTime() + 24 * 60 * 60 * 1000);
    const now = new Date();

    if (now > expiryDate) return 'Expired';

    const timeRemaining = expiryDate - now;
    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m remaining`;
  };



  return (
    <div className="news-container">
      <h2 className="news-head text-black">Pending News Moderation</h2>

      <div className="container mb-4">

        <h5 className="mb-3">Filter News</h5>
        <div className="row g-3 align-items-center">
          
        <div className="col-12">
          <div className="d-flex gap-3 flex-wrap">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="breakingNewsToggle"
                checked={filters.breakingNews}
                onChange={() => handleFilterChange('breakingNews', !filters.breakingNews)}
              />
              <label className="form-check-label" htmlFor="breakingNewsToggle">
                Breaking News 
              </label>
            </div>
          

          
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="foreignNewsToggle"
                checked={filters.foreignNews}
                onChange={() => handleFilterChange('foreignNews', !filters.foreignNews)}
              />
              <label className="form-check-label" htmlFor="foreignNewsToggle">
                Foreign News 
              </label>
            </div>

            <div className="form-check form-switch">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="localNewsToggle"
                    checked={filters.localNews}
                    onChange={() => handleFilterChange('localNews', !filters.localNews)}
                  />
                <label className="form-check-label" htmlFor="localNewsToggle">
                    Local News
                </label>
            </div>
          </div>
        </div>


            <div className="col-12">
              <h6>Categories:</h6>
              <div className="d-flex gap-3 flex-wrap">
                {availableCategories.map(category => (
                  <div className="form-check" key={category}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`category-${category.toLowerCase()}`}
                      checked={filters.categories.includes(category)}
                      onChange={() => handleFilterChange('category', category)}
                    />
                    <label className="form-check-label" htmlFor={`category-${category.toLowerCase()}`}>
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-12">
              <button 
                className="btn btn-outline-secondary"
                onClick={resetFilters}
              >
                <i className="bi bi-x-circle me-1"></i> Reset Filters
              </button>
            </div>


        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1060 }}>
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg={toastVariant}
        >
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body className={toastVariant === 'danger' ? 'text-white' : ''}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Media Preview Modal */}
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered size="lg">
        <Modal.Header closeButton className='bg-white text-black'>
          <Modal.Title>{previewType === 'video' ? 'Video Preview' : 'Image Preview'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center bg-white">
          {previewType === 'video' ? (
            <div className="ratio ratio-16x9">
              <iframe
                src={previewUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <img
              src={previewUrl}
              alt='Preview of the uploaded file'
              className="img-fluid"
              style={{ maxHeight: '70vh' }}
            />
          )}
        </Modal.Body>
      </Modal>

      {/* Content Preview Modal */}
      <Modal show={showContentModal} onHide={() => setShowContentModal(false)} centered size="lg">
        <Modal.Header closeButton className='bg-white text-black'>
          <Modal.Title>{previewTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-white text-black">
          <div className="content-preview">
            {previewContent.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </Modal.Body>
      </Modal>

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">loading</span>
          </div>
        </div>
      ) : news.length === 0 ? (
        <div className="alert alert-info mt-3" role="alert">
          No Pending Article to review
        </div>
      ) : (
        <div className="news-card-container">
          {news.map((article) => (
            <div
              key={article._id}
              className={`news-card bg-white border ${article.breakingNews ? 'border-danger' : 'border-secondary'}`}
            >
              <div className="news-metadata bg-white border-bottom border-secondary d-flex justify-content-between align-items-center">
                <span className="news-category">{article.category}</span>
                <span className="news-date text-muted">
                  {new Date(article.date).toLocaleString()}
                </span>
              </div>

              {article.breakingNews && (
                <div className="breaking-news-badge bg-danger text-white px-2 py-1 d-flex justify-content-between align-items-center">
                  <span><i className="bi bi-lightning-fill me-1"></i> BREAKING NEWS</span>
                  <small>{getBreakingNewsTimeRemaining(article.date)}</small>
                </div>
              )}

              <h3 className="news-title text-black">{article.title}</h3>

              {article.media && (
                <div className="news-media-container position-relative">
                  <img
                    src={article.media}
                    alt='Preview of the uploaded file'
                    className="news-media"
                    style={{ cursor: 'pointer', objectFit: 'cover', height: '200px', width: '100%' }}
                    onClick={() => handleMediaClick(article.media)}
                  />
                  <div
                    className="position-absolute top-0 end-0 m-2"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '4px', padding: '2px 8px' }}
                  >
                    <i className="bi bi-zoom-in text-white"></i>
                  </div>
                </div>
              )}

              <p className="news-content text-black">{article.content.slice(0, 120)}...</p>
              <div className="d-flex justify-content-end mb-2">
                <button
                  onClick={() => handleContentClick(article.title, article.content)}
                  className="btn btn-sm btn-outline-info"
                >
                  <i className="bi bi-eye"></i> View Full Content
                </button>
              </div>
              <p className="news-author text-muted">
                By {article.author?.username} ({article.author?.email})
              </p>

              <div className="news-buttons">
                <button
                  onClick={() => handleEditNews(article._id)}
                  className="btn btn-outline-primary news-edit-button"
                >
                  <i className="bi bi-pencil-square"></i> Edit Content
                </button>

                <button
                  onClick={() => toggleForeignNews(article._id, article.foreignNews)}
                  className={`btn ${article.foreignNews ? 'btn-info' : 'btn-outline-info'} news-foreign-button`}
                  disabled={foreignNewsToggleLoading === article._id}
                >
                  {foreignNewsToggleLoading === article._id ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing
                    </>
                  ) : (
                    <>
                      <i className={`bi ${article.foreignNews ? 'bi-globe' : 'bi-globe2'}`}></i>
                      {article.foreignNews ? 'Unmark Foreign' : 'Mark Foreign'}
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleBreakingNews(article._id, article.breakingNews)}
                  className={`btn ${article.breakingNews ? 'btn-warning' : 'btn-outline-warning'} news-breaking-button`}
                  disabled={breakingNewsToggleLoading === article._id}
                >
                  {breakingNewsToggleLoading === article._id ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Processing
                    </>
                  ) : (
                    <>
                      <i className={`bi ${article.breakingNews ? 'bi-lightning-fill' : 'bi-lightning'}`}></i>
                      {article.breakingNews ? 'Unmark Breaking' : 'Mark Breaking'}
                    </>
                  )}
                </button>

                <button
                  onClick={() => updateStatus(article._id, 'accept')}
                  className="btn btn-success news-accept-button"
                  disabled={actionLoading === article._id}
                >
                  {actionLoading === article._id ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle"></i> Accept
                    </>
                  )}
                </button>
                <button
                  onClick={() => updateStatus(article._id, 'reject')}
                  className="btn btn-danger news-reject-button"
                  disabled={actionLoading === article._id}
                >
                  {actionLoading === article._id ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-x-circle"></i> Reject
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PendingNewsModeration 