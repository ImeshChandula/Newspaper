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

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/news/accept`,
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

  const updateStatus = async (id, status) => {
    setActionLoading(id);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/news/updateStatus/${id}`,
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
        `${process.env.REACT_APP_API_URL}/news/toggleBreakingNews/${id}`,
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
