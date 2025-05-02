import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
//import TrackAds from './TrackAds';

const AdManager = () => {
  const [form, setForm] = useState({
    title: '',
    content: '',
    media: '',
    link: '',
    endDate: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/ads/createAd',
        form,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        }
      );

      setMessage("✅ " + response.data.msg);
      setForm({
        title: '',
        content: '',
        media: '',
        link: '',
        endDate: '',
      });
    } catch (err) {
      setError(err.response?.data?.msg || "❌ Failed to create ad");
    }
  };

  return (
    <div className="container">
      <div className="bg-dark p-4 rounded shadow text-white">
        <h2 className="text-center text-primary mb-4">📢 Create New Ad</h2>

        {message && <div className="alert alert-success text-center">{message}</div>}
        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="row g-4">

          <div className="col-md-6">
            <label className="form-label">📝 Title</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Enter ad title"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">📅 End Date</label>
            <input
              type="date"
              name="endDate"
              className="form-control"
              value={form.endDate}
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <label className="form-label">🖊️ Content</label>
            <textarea
              name="content"
              className="form-control"
              rows="4"
              value={form.content}
              onChange={handleChange}
              required
              placeholder="Enter ad description..."
            ></textarea>
          </div>

          <div className="col-md-6">
            <label className="form-label">🖼️ Media URL</label>
            <input
              type="text"
              name="media"
              className="form-control"
              value={form.media}
              onChange={handleChange}
              required
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">🔗 Ad Link</label>
            <input
              type="text"
              name="link"
              className="form-control"
              value={form.link}
              onChange={handleChange}
              required
              placeholder="https://your-ad-link.com"
            />
          </div>

          <div className="col-12 text-center">
            <button
              type="submit"
              className="btn btn-primary mt-3 px-5 py-2 fs-5"
              disabled={loading}
            >
              {loading ? "🚀 Submitting..." : "🚀 Submit Ad"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AdManager;
