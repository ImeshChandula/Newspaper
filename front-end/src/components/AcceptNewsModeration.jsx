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

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL_NEWS}/accept`,
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

  return (
    <div className="news-container">
      <h2 className="news-head text-primary">Accepted News Moderation</h2>

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
        <Modal.Header closeButton className='bg-dark text-white'>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center bg-dark">
          <img
            src={previewImage}
            alt='Preview of the uploaded file'
            className="img-fluid"
            style={{ maxHeight: '70vh' }}
          />
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
          No Accepted Articles
        </div>
      ) : (
        <div className="news-card-container">
          {news.map((article) => (
            <div key={article._id} className="news-card bg-dark border border-secondary">
              <div className="news-metadata bg-dark border-bottom border-secondary">
                <span className="news-category">{article.category}</span>
                <span className="news-date">
                  {new Date(article.date).toLocaleString()}
                </span>
              </div>

              <h3 className="news-title text-primary">{article.title}</h3>

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

              <p className="news-content text-white">{article.content.slice(0, 150)}...</p>
              <p className="news-author">
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
