import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdCarousel = () => {
  const [ads, setAds] = useState([]);
  const [error, setError] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const token = localStorage.getItem('token');

  const fetchAds = async () => {
    try {
      const { data } = await axios.get(
        'http://localhost:5000/api/ads/getAllActiveAds',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAds(data.ads);
    } catch (err) {
      setError('❌ Error fetching ads: ' + (err.response?.data?.msg || err.message));
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  useEffect(() => {
    if (ads.length) {
      const timer = setTimeout(() => setCollapsed(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [ads]);

  if (!ads.length) return null;

  if (collapsed) {
    return (
      <div className="fixed-bottom mb-3 ms-3">
        <button className="btn btn-sm btn-primary" onClick={() => setCollapsed(false)}>
          Show Ads
        </button>
      </div>
    );
  }

  return (
    <div className="w-100 py-3 px-2 px-md-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h4 className="text-primary mb-0">📢 Ads</h4>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => setCollapsed(true)}
        >
          Collapse
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div
        id="adsCarousel"
        className="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval="7000"
        style={{ height: '300px' }}
      >
        {/* Indicators */}
        <div className="carousel-indicators">
          {ads.map((_, idx) => (
            <button
              key={idx}
              type="button"
              data-bs-target="#adsCarousel"
              data-bs-slide-to={idx}
              className={idx === 0 ? 'active' : ''}
              aria-current={idx === 0 ? 'true' : undefined}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Carousel Items */}
        <div className="carousel-inner h-100">
          {ads.map((ad, idx) => (
            <div
              key={ad._id}
              className={`carousel-item h-100 ${idx === 0 ? 'active' : ''}`}
            >
              <div className="h-100 d-flex justify-content-center align-items-center">
                <div
                  className="card text-white w-100 h-100 mx-2"
                  style={{
                    background: `url(${ad.media}) center/cover no-repeat`,
                    border: 'none',
                    borderRadius: '0.75rem',
                    minHeight: '100%',
                  }}
                >
                  <div
                    className="card-img-overlay d-flex flex-column justify-content-end p-3"
                    style={{
                      background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                    }}
                  >
                    <h5 className="card-title text-truncate">{ad.title}</h5>
                    <p
                      className="card-text"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontSize: '0.95rem',
                      }}
                    >
                      {ad.content}
                    </p>
                    <a
                      href={ad.link}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-light mt-2 align-self-start mb-3"
                    >
                      Visit link
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdCarousel;
