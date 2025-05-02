import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdManager = () => {
  const [ads, setAds] = useState([]);
  const [form, setForm] = useState({
    title: '',
    content: '',
    media: '',
    link: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAds([...ads, form]);
    setForm({
      title: '',
      content: '',
      media: '',
      link: ''
    });
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4 text-primary">Ad Manager</h2>

      <form onSubmit={handleSubmit} className="row g-4">
        <div className="col-md-6">
          <label className="form-label text-white">Title</label>
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
          <label className="form-label text-white">Content</label>
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
          <label className="form-label text-white">Media URL</label>
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
          <label className="form-label text-white">Ad Link</label>
          <input
            type="text"
            name="link"
            className="form-control"
            value={form.link}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-12 text-center text-white">
          <button type="submit" className="btn btn-primary mt-3">Submit Ad</button>
        </div>
      </form>

      <hr className="my-5" />

      <h3 className="text-center mb-4 text-primary">Submitted Ads</h3>
      <div className="row">
        {ads.map((ad, index) => (
          <div className="col-md-6 col-lg-4 mb-4" key={index}>
            <div className="card h-100">
              {ad.media && (
                <img src={ad.media} className="card-img-top" alt="Ad" />
              )}
              <div className="card-body">
                <h5 className="card-title">{ad.title}</h5>
                <p className="card-text">{ad.content}</p>
                <p>
                  <strong>Link:</strong>{' '}
                  <a href={ad.link} target="_blank" rel="noreferrer">{ad.link}</a>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdManager;
