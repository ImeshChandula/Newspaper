import React, { useState } from 'react';
import axios from 'axios';
import '../components/css/CreateNewsArticle.css';

const CreateNewsArticle = () => {

  const [formData, setFormData] = useState({
    category: '',
    title: '',
    media: '',
    content: '',
    breakingNews: false
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    // eslint-disable-next-line no-unused-vars
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
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
      setMessage('News Created Success');
      setFormData({ category: '', title: '', media: '', content: '', breakingNews: false });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something Went Wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8 col-xl-6 bg-white text-black p-4 rounded shadow-lg border border-secondary">
          <h2 className="text-center mb-4 border-bottom pb-2 text-black fw-bold">Create News Article</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="form-select text-black border-secondary"
              >
                <option value="">Select Category</option>
                <option value="Education">Education</option>
                <option value="Politics">Politics</option>
                <option value="Sports">Sports</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                required
                className="form-control bg-white text-black border-secondary"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Media URL (optional)</label>
              <input
                type="text"
                name="media"
                placeholder="Media URL"
                value={formData.media}
                onChange={handleChange}
                className="form-control bg-white text-black border-secondary"
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Content</label>
              <textarea
                name="content"
                placeholder="Content"
                value={formData.content}
                onChange={handleChange}
                required
                rows="5"
                className="form-control bg-white text-black border-secondary"
              ></textarea>
            </div>

            <div className="mb-3 form-check">
              <input
                type="checkbox"
                name="breakingNews"
                id="breakingNews"
                checked={formData.breakingNews}
                onChange={handleChange}
                className="form-check-input"
              />
              <label className="form-check-label" htmlFor="breakingNews">
                Mark as Breaking News
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create News'}
            </button>
          </form>

          {message && (
            <div className="alert alert-info mt-4 text-center">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );

};

export default CreateNewsArticle;
