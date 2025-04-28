import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import '../components/css/CreateNewsArticle.css';

const CreateNewsArticle = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    category: '',
    title: '',
    media: '',
    content: '',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL_NEWS}/createNewsArticle`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log("News article created successfully!");
      setMessage(t('newsCreatedSuccess'));
      setFormData({ category: '', title: '', media: '', content: '' });
    } catch (error) {
      setMessage(error.response?.data?.message || t('somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create_news_container">
      <h2 className="create_news_header">{t('createNewsArticle')}</h2>
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
          <option value="Breaking News">{t('breakingNews')}</option>
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

        <button
          type="submit"
          className="create_news_submit_button"
          disabled={loading}
        >
          {loading ? t('submitting') : t('submit')}
        </button>
      </form>

      {message && <p className="create_news_message">{message}</p>}
    </div>
  );
};

export default CreateNewsArticle;
