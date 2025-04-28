import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../components/css/CreateNewsArticle.css';

const EditNewsContent = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const [articleId, setArticleId] = useState('');
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    media: '',
    content: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const id = location.state?.articleId;
    if (id) {
      setArticleId(id);
      fetchArticleData(id);
    } else {
      const urlParams = new URLSearchParams(location.search);
      const paramId = urlParams.get('id');
      const storedId = localStorage.getItem('editNewsId');

      if (paramId) {
        setArticleId(paramId);
        fetchArticleData(paramId);
      } else if (storedId) {
        setArticleId(storedId);
        fetchArticleData(storedId);
      } else {
        setFetchLoading(false);
        setMessage(t('noArticleId'));
      }
    }
  }, [location, t]);

  const fetchArticleData = async (id) => {
    setFetchLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/news/getNewsArticleByID/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const article = res.data;
      setFormData({
        category: article.category || '',
        title: article.title || '',
        media: article.media || '',
        content: article.content || '',
      });
    } catch (error) {
      console.error('Error fetching article:', error);
      setMessage(t('fetchArticleError'));
    } finally {
      setFetchLoading(false);
    }
  };

  const goToDashboard = () => {
    if (!user) return;
    switch (user.role) {
      case "editor":
        navigate("/dashboard/editor");
        break;
      case "admin":
        navigate("/dashboard/admin");
        break;
      case "super_admin":
        navigate("/dashboard/super-admin");
        break;
      default:
        navigate("/unauthorized");
        break;
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/news/updateNewsArticleByID/${articleId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setMessage(t('updateSuccess'));
      setTimeout(() => {
        localStorage.removeItem('editNewsId');
        goToDashboard();
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || t('updateError'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    localStorage.removeItem('editNewsId');
    goToDashboard();
  };

  if (fetchLoading) {
    return (
      <div className="create_news_container">
        <p>{t('loadingArticle')}</p>
      </div>
    );
  }

  return (
    <div className="create_news_container py-5 mt-5">
      <h2 className="create_news_header">{t('editNewsArticle')}</h2>
      {articleId ? (
        <form onSubmit={handleSubmit} className="create_news_form">
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="create_news_input_select"
          >
            <option value="">{t('selectCategory')}</option>
            <option value="Education">{t('education')}</option>
            <option value="Politics">{t('politics')}</option>
            <option value="Sports">{t('sports')}</option>
          </select>

          <input
            type="text"
            name="title"
            placeholder={t('title')}
            value={formData.title}
            onChange={handleChange}
            required
            className="create_news_input_text"
          />

          <input
            type="text"
            name="media"
            placeholder={t('mediaUrl')}
            value={formData.media}
            onChange={handleChange}
            className="create_news_input_text"
          />

          <textarea
            name="content"
            placeholder={t('content')}
            value={formData.content}
            onChange={handleChange}
            required
            rows="5"
            className="create_news_input_textarea"
          ></textarea>

          <div className="edit_news_buttons">
            <button
              type="submit"
              className="create_news_submit_button"
              disabled={loading}
            >
              {loading ? t('updating') : t('updateArticle')}
            </button>

            <button
              type="button"
              className="edit_news_cancel_button"
              onClick={handleCancel}
            >
              {t('cancel')}
            </button>
          </div>
        </form>
      ) : (
        <div className="create_news_message">
          <p>{message}</p>
          <button
            onClick={() => navigate('/acceptNewsModeration')}
            className="create_news_submit_button"
          >
            {t('backToModeration')}
          </button>
        </div>
      )}

      {message && <p className="create_news_message">{message}</p>}
    </div>
  );
};

export default EditNewsContent;
