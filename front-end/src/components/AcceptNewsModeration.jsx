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
  const [previewImage, setPreviewImage] = useState('');

  // New state for content preview modal
  const [showContentModal, setShowContentModal] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const [breakingNewsToggleLoading, setBreakingNewsToggleLoading] = useState(null);
  const [foreignNewsToggleLoading, setForeignNewsToggleLoading] = useState(null);

  const [filterBreakingNews, setFilterBreakingNews] = useState(false);
  const [filterForeignNews, setFilterForeignNews] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState([]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      // Build query string based on filters
      const queryParams = new URLSearchParams();
      if (filterBreakingNews) queryParams.append('breakingNews', 'true');
      if (filterForeignNews) queryParams.append('foreignNews', 'true');

      selectedCategories.forEach((cat) => queryParams.append('category', cat));

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
  }, [filterBreakingNews, filterForeignNews, selectedCategories]);

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
    localStorage.setItem('Edit NewsId', articleId);
    navigate('/editNews', { state: { articleId } });
  };

  const showNotification = (message, variant) => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  const handleImageClick = (imageUrl) => {
    setPreviewImage(imageUrl);
    setShowImageModal(true);
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
                checked={filterBreakingNews}
                onChange={() => setFilterBreakingNews(!filterBreakingNews)}
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
                checked={filterForeignNews}
                onChange={() => setFilterForeignNews(!filterForeignNews)}
              />
              <label className="form-check-label" htmlFor="foreignNewsToggle">
                Foreign News 
              </label>
            </div>
          </div>
        </div>


          <div className="col-12">
            <h6>Categories:</h6>
            <div className="d-flex gap-3 flex-wrap">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="category-sports"
                  checked={selectedCategories.includes('Sports')}
                  onChange={() => toggleCategory('Sports')}
                />
                <label className="form-check-label" htmlFor="category-sports">
                  Sport News 
                </label>
              </div>
            </div>

            <div className="d-flex gap-3 flex-wrap">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="category-education"
                  checked={selectedCategories.includes('Education')}
                  onChange={() => toggleCategory('Education')}
                />
                <label className="form-check-label" htmlFor="category-education">
                  Education News 
                </label>
              </div>
            </div>

            <div className="d-flex gap-3 flex-wrap">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="category-politics"
                  checked={selectedCategories.includes('Politics')}
                  onChange={() => toggleCategory('Politics')}
                />
                <label className="form-check-label" htmlFor="category-politics">
                  Political News 
                </label>
              </div>
            </div>
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

      {/* Image Preview Modal */}
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered size="lg">
        <Modal.Header closeButton className='bg-white text-black'>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center bg-white">
          <img
            src={previewImage}
            alt='Preview of the uploaded file'
            className="img-fluid"
            style={{ maxHeight: '70vh' }}
          />
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

              {article.media && (
                <div className="news-media-container position-relative">
                  <img
                    src={article.media}
                    alt='Preview of the uploaded file'
                    className="news-media"
                    style={{ cursor: 'pointer', objectFit: 'cover', height: '200px', width: '100%' }}
                    onClick={() => handleImageClick(article.media)}
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