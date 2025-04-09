import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../components/css/PendingNewsModeration.css';
import Modal from 'react-bootstrap/Modal';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import 'bootstrap/dist/css/bootstrap.min.css';

const AcceptNewsModeration = () => {

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
  const [previewImage, setPreviewImage] = useState("");

  const fetchNews = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get('http://localhost:5000/api/news/accept', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("API Response:", res.data); 
      setNews(res.data);
    } catch (error) {
      console.error('Error fetching Accept news:', error);
      showNotification("Failed to load accepted news articles", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log("Accept news loaded:", news);
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
      showNotification(`Article is no longer displayed on the site`, "success");
    } catch (error) {
      console.error(`Failed to ${status} article:`, error);
      showNotification(`Failed to update article status`, "danger");
    } finally {
      setActionLoading(null);
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
  
  // Function to open image in modal
  const handleImageClick = (imageUrl) => {
    setPreviewImage(imageUrl);
    setShowImageModal(true);
  };




  return (
    <div className="news_card_container">
      <h2 className="news_head">Accepted News Moderation</h2>
      
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
          No accepted articles to review.
        </div>
      ) : (
        <div className="news_card_">
          {news.map((article) => (
            <div key={article._id} className="news shadow-sm">
              <div className="news_sub">
                <span className="badge bg-success news_span_1">{article.category}</span>
                <span className="news_span_2">
                  {new Date(article.date).toLocaleString()}
                </span>
              </div>
              <h3 className="news_title">{article.title}</h3>
              
              {/* Enhanced image display */}
              {article.media && (
                <div className="position-relative mb-3">
                  <img 
                    src={article.media} 
                    alt="Article media" 
                    className="news_media img-fluid rounded shadow-sm cursor-pointer"
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
              
              <p className="news_content">{article.content.slice(0, 150)}...</p>
              <p className="news_author">By: {article.author?.username} ({article.author?.email})</p>

              <div className="news_buttons">
                <button 
                  onClick={() => handleEditNews(article._id)} 
                  className="btn btn-outline-primary news_edit_button"
                >
                  <i className="bi bi-pencil-square"></i> Edit content
                </button>
                <button
                  onClick={() => updateStatus(article._id, 'reject')}
                  className="btn btn-warning news_reject_button"
                  disabled={actionLoading === article._id}
                >
                  {actionLoading === article._id ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing...
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
  )
}

export default AcceptNewsModeration