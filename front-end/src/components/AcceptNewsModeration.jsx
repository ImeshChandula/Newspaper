import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/css/NewsModeration.css';

const AcceptNewsModeration = () => {
  const { t } = useTranslation();
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
      showNotification(t('fetchAcceptedFail'), 'danger');
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
      showNotification(t('articleRemoved'), 'success');
    } catch (error) {
      console.error('Failed to update article status:', error);
      showNotification(t('updateStatusFail'), 'danger');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditNews = (articleId) => {
    localStorage.setItem('editNewsId', articleId);
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
      <h2 className="news-head">{t('acceptedModerationTitle')}</h2>

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
            <strong className="me-auto">{t('notificationTitle')}</strong>
          </Toast.Header>
          <Toast.Body className={toastVariant === 'danger' ? 'text-white' : ''}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Image Preview Modal */}
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{t('imagePreview')}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img
            src={previewImage}
            alt={t('imagePreview')}
            className="img-fluid"
            style={{ maxHeight: '70vh' }}
          />
        </Modal.Body>
      </Modal>

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">{t('loading')}</span>
          </div>
        </div>
      ) : news.length === 0 ? (
        <div className="alert alert-info mt-3" role="alert">
          {t('noAcceptedArticles')}
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

              {article.media && (
                <div className="news-media-container position-relative">
                  <img
                    src={article.media}
                    alt={t('imagePreview')}
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

              <p className="news-content">{article.content.slice(0, 150)}...</p>
              <p className="news-author">
                {t('by')} {article.author?.username} ({article.author?.email})
              </p>

              <div className="news-buttons">
                <button
                  onClick={() => handleEditNews(article._id)}
                  className="btn btn-outline-primary news-edit-button"
                >
                  <i className="bi bi-pencil-square"></i> {t('editContent')}
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
                      {t('processing')}
                    </>
                  ) : (
                    <>
                      <i className="bi bi-eye-slash"></i> {t('stopShowing')}
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
