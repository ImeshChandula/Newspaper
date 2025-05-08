import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/css/NewsModeration.css';

const AcceptNewsModeration = () => {
  const navigate = useNavigate();

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  const [showImageModal, setShowImageModal] = useState(false);
  //const [previewImage, setPreviewImage] = useState('');

  // New state for content preview modal
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

  const fetchNews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      // Build query string based on filters
      const queryParams = new URLSearchParams();
      if (filters.breakingNews) queryParams.append('breakingNews', 'true');
      if (filters.foreignNews) queryParams.append('foreignNews', 'true');
      if (filters.localNews) queryParams.append('foreignNews', 'false');
      filters.categories.forEach((cat) => queryParams.append('category', cat));

      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL_NEWS}/accept?${queryParams.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNews(response.data);
    } catch (error) {
      console.error('Error fetching accepted news:', error);
      showNotification('fetchAcceptedFail', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const updateStatus = async (id, status) => {
    setActionLoading(id);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL_NEWS}/updateStatus/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNews((prev) => prev.filter((article) => article._id !== id));
      showNotification('Article Removed', 'success');
    } catch (error) {
      console.error('Failed to update article status:', error);
      showNotification('Update Status Fail', 'danger');
    } finally {
      setActionLoading(null);
    }
  };

  const toggleBreakingNews = async (id, currentStatus) => {
    setBreakingNewsToggleLoading(id);
    try {
      const token = localStorage.getItem('token');
      
      await axios.patch(
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
    localStorage.setItem('Edit NewsId', articleId);
    navigate('/editNews', { state: { articleId } });
  };

  const showNotification = (message, variant) => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  const [previewType, setPreviewType] = useState('image'); // 'image' or 'video'
  const [previewUrl, setPreviewUrl] = useState('');

  // Function to extract YouTube video ID from URL
  const getYouTubeId = (url) => {
    if (!url) return null;
    
    // Match patterns like youtube.com/watch?v=VIDEO_ID or youtu.be/VIDEO_ID
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Function to check if URL is a YouTube URL
  const isYouTubeUrl = (url) => {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  // Function to get YouTube thumbnail URL from video ID
  const getYouTubeThumbnailUrl = (videoId) => {
    // Use the high quality thumbnail (hqdefault)
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  const handleMediaClick = (mediaUrl) => {
    // Check if it's a YouTube URL
    if (isYouTubeUrl(mediaUrl)) {
      setPreviewType('video');
      // Extract video ID from YouTube URL
      const videoId = getYouTubeId(mediaUrl);
      
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


  // New function to handle content preview
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


  // Render media with proper thumbnail for videos
  const renderMediaThumbnail = (mediaUrl) => {
    if (!mediaUrl) return null;
    
    if (isYouTubeUrl(mediaUrl)) {
      const videoId = getYouTubeId(mediaUrl);
      if (videoId) {
        return (
          <div className="news-media-container position-relative">
            <img
              src={getYouTubeThumbnailUrl(videoId)}
              alt="YouTube video thumbnail"
              className="news-media"
              style={{ cursor: 'pointer', objectFit: 'cover', height: '200px', width: '100%' }}
              onClick={() => handleMediaClick(mediaUrl)}
            />
            <div 
              className="position-absolute top-0 end-0 m-2"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '4px', padding: '2px 8px' }}
            >
              <i className="bi bi-zoom-in text-white"></i>
            </div>
            <div 
              className="position-absolute bottom-0 start-50 translate-middle-x mb-2 px-3 py-1"
              style={{ backgroundColor: 'rgba(255,0,0,0.8)', borderRadius: '4px', color: 'white' }}
            >
              <i className="bi bi-youtube me-1"></i>
              YouTube Video
            </div>
          </div>
        );
      }
    }
    
    // Regular image
    return (
      <div className="news-media-container position-relative">
        <img
          src={mediaUrl}
          alt="News media"
          className="news-media"
          style={{ cursor: 'pointer', objectFit: 'cover', height: '200px', width: '100%' }}
          onClick={() => handleMediaClick(mediaUrl)}
        />
        <div
          className="position-absolute top-0 end-0 m-2"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '4px', padding: '2px 8px' }}
        >
          <i className="bi bi-zoom-in text-white"></i>
        </div>
      </div>
    );
  };





  return (
    <div className="news-container">
      <h2 className="news-head text-black">Accepted News Moderation</h2>

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
          <div className="spinner-border text-black" role="status">
            <span className="visually-hidden">loading</span>
          </div>
        </div>
      ) : news.length === 0 ? (
        <div className="alert alert-info mt-3" role="alert">
          No Accepted Articles
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

              {/* Media content */}
              {article.media && renderMediaThumbnail(article.media)}

              <p className="news-content text-black">{article.content.slice(0, 120)}...</p>
              <div className="d-flex justify-content-end mb-2">
                <button
                  onClick={() => handleContentClick(article.title, article.content)}
                  className="btn btn-sm btn-outline-info"
                >
                  <i className="bi bi-eye"></i> View Full Content
                </button>
              </div>

              <p className="news-author text-muted small">
                By {article.author?.username} ({article.author?.email})
              </p>

              <div className="news-buttons">
                <button
                  onClick={() => toggleForeignNews(article._id, article.foreignNews)}
                  className={`btn ${article.foreignNews ? 'btn-info' : 'btn-outline-info'} ms-2`}
                  disabled={foreignNewsToggleLoading === article._id}
                >
                  {foreignNewsToggleLoading === article._id ? (
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
                      <i className={`bi ${article.foreignNews ? 'bi-globe2' : 'bi-globe'}`}></i>
                      {article.foreignNews ? ' Unmark Foreign' : ' Mark Foreign'}
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleEditNews(article._id)}
                  className="btn btn-outline-primary news-edit-button"
                >
                  <i className="bi bi-pencil-square"></i> Edit Content
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
                  onClick={() => updateStatus(article._id, 'reject')}
                  className="btn btn-danger news-reject-button"
                  disabled={actionLoading === article._id}
                >
                  {actionLoading === article._id ? (
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
                      <i className="bi bi-eye-slash"></i> Stop Showing
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AcceptNewsModeration;