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

  const fetchNews = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get('http://localhost:5000/api/news/reject', {
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
      await axios.patch(`http://localhost:5000/api/news/updateStatus/${id}`, 
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

  const handleEditNews = (articleId) => {
    localStorage.setItem("editNewsId", articleId);
    navigate('/editNews', { state: { articleId } });
  };

  // Show confirmation modal instead of browser alert
  const confirmDelete = (id) => {
    setArticleToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeletePermanent = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this article? This action cannot be undone.")) {
      try {
        setDeleteLoading(articleToDelete);
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/news/deleteNewsArticleByID/${articleToDelete}`, {
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


  return (
    <div className="news-container">
      <h2 className="news-head">Rejected News Moderation</h2>
      
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
        <Modal.Header closeButton>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img 
            src={previewImage} 
            alt="Full size preview" 
            className="img-fluid" 
            style={{ maxHeight: '70vh' }}
          />
        </Modal.Body>
      </Modal>

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : news.length === 0 ? (
        <div className="alert alert-info mt-3" role="alert">
          No rejected articles to review.
        </div>
      ) : (
        <div className="news-card-container">
          {news.map((article) => (
            <div key={article._id} className="news-card">
              <div className="news-metadata">
                <span className="news-category">{article.category}</span>
                <span className="news-date">
                  {new Date(article.date).toLocaleString()}
                </span>
              </div>
              <h3 className="news-title">{article.title}</h3>
              
              {/* Enhanced image display */}
              {article.media && (
                <div className="news-media-container">
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
              
              <p className="news-content">{article.content.slice(0, 150)}...</p>
              <p className="news-author">By: {article.author?.username} ({article.author?.email})</p>

              <div className="news-buttons">
                <button 
                  onClick={() => handleEditNews(article._id)} 
                  className="btn btn-outline-primary news-edit-button"
                >
                  <i className="bi bi-pencil-square"></i> Edit content
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