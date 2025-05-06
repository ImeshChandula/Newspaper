import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../components/css/NewsModeration.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import 'bootstrap/dist/css/bootstrap.min.css';

const RejectNewsModeration = () => {

  const navigate = useNavigate();

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // State for modal and toasts
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  // Image preview modal state
  const [showImageModal, setShowImageModal] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // Content preview modal state
  const [showContentModal, setShowContentModal] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const [breakingNewsToggleLoading, setBreakingNewsToggleLoading] = useState(null);

  const fetchNews = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL_NEWS}/reject`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("API Response:", res.data);
      setNews(res.data);
    } catch (error) {
      console.error('Error fetching Reject news:', error);
      showNotification("Failed to load rejected news articles", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log("Rejected news loaded:", news);
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
      setNews(news.filter(article => article._id !== id));
      showNotification(`Article successfully ${status === 'accept' ? 'accepted' : status}ed`, "success");
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

  const handleEditNews = (articleId) => {
    localStorage.setItem("editNewsId", articleId);
    navigate('/editNews', { state: { articleId } });
  };

  // Show confirmation modal instead of browser alert
  const confirmDelete = (id) => {
    setArticleToDelete(id);
    setShowDeleteModal(true);
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

  const handleDeletePermanent = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this article? This action cannot be undone.")) {
      try {
        setDeleteLoading(articleToDelete);
        const token = localStorage.getItem("token");
        await axios.delete(`${process.env.REACT_APP_API_BASE_URL_NEWS}/deleteNewsArticleByID/${articleToDelete}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Remove the deleted article from the state
        setNews(news.filter(article => article._id !== articleToDelete));
        showNotification("Article permanently deleted", "success");
        console.log("Article permanently deleted");
      } catch (error) {
        console.error("Failed to delete article permanently:", error);
        showNotification("Failed to delete article. Please try again.", "danger");
      } finally {
        setDeleteLoading(null);
        setShowDeleteModal(false);
        setArticleToDelete(null);
      }
    }
  };


  // Helper function to show toast notifications
  const showNotification = (message, variant) => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  // Function to open image in modal
  const handleImageClick = (imageUrl) => {
    setPreviewImage(imageUrl);
    setShowImageModal(true);
  };

  const handleContentClick = (title, content) => {
    setPreviewTitle(title);
    setPreviewContent(content);
    setShowContentModal(true);
  };


  return (
    <div className="news-container">
      <h2 className="news-head text-black">Rejected News Moderation</h2>

      {/* Toast notifications */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1060 }}>
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          bg={toastVariant}
        >
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body className={toastVariant === "danger" ? "text-white" : ""}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Delete confirmation modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to permanently delete this article? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeletePermanent}
            disabled={deleteLoading === articleToDelete}
          >
            {deleteLoading === articleToDelete ? 'Deleting...' : 'Delete Permanently'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Image preview modal */}
      <Modal
        show={showImageModal}
        onHide={() => setShowImageModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton className='bg-white text-black'>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center bg-white">
          <img
            src={previewImage}
            alt="Full size preview"
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
            <span className="visually-hidden tect-black">Loading...</span>
          </div>
        </div>
      ) : news.length === 0 ? (
        <div className="alert alert-info mt-3" role="alert">
          No rejected articles to review.
        </div>
      ) : (
        <div className="news-card-container">
          {news.map((article) => (
            <div key={article._id} className={`news-card bg-white border ${article.breakingNews ? 'border-danger' : 'border-secondary'}`}>
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

              {/* Enhanced image display */}
              {article.media && (
                <div className="news-media-container position-relative">
                  <img
                    src={article.media}
                    alt="Article media"
                    className="news-media"
                    style={{
                      cursor: 'pointer',
                      objectFit: 'cover',
                      height: '200px',
                      width: '100%'
                    }}
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

              <p className="news-author text-muted">By: {article.author?.username} ({article.author?.email})</p>

              <div className="news-buttons">
                <button
                  onClick={() => handleEditNews(article._id)}
                  className="btn btn-outline-primary news-edit-button"
                >
                  <i className="bi bi-pencil-square"></i> Edit content
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
                      Accepting...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle"></i> Accept
                    </>
                  )}
                </button>
                <button
                  onClick={() => confirmDelete(article._id)}
                  className="btn btn-danger news-reject-button"
                >
                  <i className="bi bi-trash"></i> Delete permanent
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RejectNewsModeration