import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdateAdManager = () => {
  const { id } = useParams(); // get ad ID from URL
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    title: '',
    content: '',
    media: '',
    link: '',
    endDate: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch ad details on mount
  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/ads/getAdById/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const ad = response.data.ad;
        setForm({
          title: ad.title || '',
          content: ad.content || '',
          media: ad.media || '',
          link: ad.link || '',
          endDate: ad.endDate ? ad.endDate.substring(0, 10) : '', // format for date input
        });
      } catch (err) {
        setError('❌ Failed to load ad details');
      }
    };
    fetchAd();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/ads/updateAd/${id}`,
        form,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        }
      );
      setMessage("✅ " + response.data.msg);
      setTimeout(() => navigate('/track-ads'), 1500); // redirect after success
    } catch (err) {
      setError(err.response?.data?.msg || "❌ Failed to update ad");
    }
  };

  return (
    <div className="container py-5 text-white">
      <h2 className="text-center text-warning mb-4">✏️ Update Ad</h2>

      {message && <div className="alert alert-success text-center">{message}</div>}
      {error && <div className="alert alert-danger text-center">{error}</div>}

      <form onSubmit={handleSubmit} className="row g-4">

        <div className="col-md-6">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Content</label>
          <input
            type="text"
            name="content"
            className="form-control"
            value={form.content}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Media URL</label>
          <input
            type="text"
            name="media"
            className="form-control"
            value={form.media}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Ad Link</label>
          <input
            type="text"
            name="link"
            className="form-control"
            value={form.link}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">End Date</label>
          <input
            type="date"
            name="endDate"
            className="form-control"
            value={form.endDate}
            onChange={handleChange}
          />
        </div>

        <div className="col-12 text-center">
          <button type="submit" className="btn btn-warning mt-3">Update Ad</button>
        </div>
      </form>
    </div>
  );
};

export default UpdateAdManager;
