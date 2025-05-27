import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './css/AdSection.css';

const AdSection = () => {
  const [ads, setAds] = useState([]);
  const [error, setError] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const impressionSet = useRef(new Set());
  const token = localStorage.getItem('token');

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const fetchAds = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL_ADS}/getAllActiveAds`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAds(data.ads);
    } catch (err) {
      setError('❌ Error fetching ads: ' + (err.response?.data?.msg || err.message));
    }
  };

  const trackImpression = async (adId) => {
    if (impressionSet.current.has(adId)) return;
    impressionSet.current.add(adId);
    try {
      await axios.patch(`${process.env.REACT_APP_API_BASE_URL_ADS}/trackAdImpression/${adId}`);
    } catch (err) {
      console.error('Error tracking impression:', err.message);
    }
  };

  const handleVisitClick = async (e, ad) => {
    e.preventDefault();
    try {
      await axios.patch(`${process.env.REACT_APP_API_BASE_URL_ADS}/trackAdClick/${ad._id}`);
    } catch (err) {
      console.error('Error tracking click:', err.message);
    } finally {
      window.open(ad.link, '_blank');
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  useEffect(() => {
    if (!ads.length) return;

    trackImpression(ads[0]._id);

    const autoplayInterval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % ads.length;
        trackImpression(ads[next]._id);
        return next;
      });
    }, 4000);

    return () => clearInterval(autoplayInterval);
  }, [ads]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const deltaX = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        setActiveIndex((prev) => {
          const next = (prev + 1) % ads.length;
          trackImpression(ads[next]._id);
          return next;
        });
      } else {
        setActiveIndex((prev) => {
          const next = prev === 0 ? ads.length - 1 : prev - 1;
          trackImpression(ads[next]._id);
          return next;
        });
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!ads.length) return null;

  const extractDriveFileId = (url) => {
    const match = url.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]{10,})/);
    return match ? match[1] : null;
  };

  const getGoogleDriveThumbnail = (url) => {
    const fileId = extractDriveFileId(url);
    if (!fileId) return url;
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`;
  };

  const isGoogleDriveLink = (url) => /drive\.google\.com/.test(url);

  return (
    <div className="container py-5">
      <h3 className="text-start mb-4">📢 Sponsored Ads</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <div
        className="ad-carousel mx-auto"
        style={{ maxWidth: '1000px', height: '250px' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides */}
        {ads.map((ad, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div
              key={ad._id}
              className={`ad-slide ${isActive ? 'active' : ''}`}
              style={{
                backgroundImage: `url(${isGoogleDriveLink(ad.media)
                  ? getGoogleDriveThumbnail(ad.media)
                  : ad.media
                  })`,
              }}
              aria-hidden={!isActive}
              role="tabpanel"
            >
              <div className="ad-overlay p-4 d-flex flex-column justify-content-end h-100 rounded">
                <h5 className="fw-bold text-white text-shadow">{ad.title}</h5>
                <p
                  className="text-white text-shadow mb-3"
                  style={{
                    lineHeight: '1.2em',
                    maxHeight: '3.6em',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {ad.content}
                </p>
                <button
                  className="btn btn-outline-light btn-sm align-self-start"
                  onClick={(e) => handleVisitClick(e, ad)}
                >
                  Visit Link
                </button>
              </div>
            </div>
          );
        })}

        {/* Navigation buttons */}
        <button
          className="ad-nav-btn ad-prev d-none d-md-flex"
          onClick={() =>
            setActiveIndex((prev) => {
              const next = prev === 0 ? ads.length - 1 : prev - 1;
              trackImpression(ads[next]._id);
              return next;
            })
          }
          aria-label="Previous"
        >
          <ChevronLeft size={24} color="white" />
        </button>

        <button
          className="ad-nav-btn ad-next d-none d-md-flex"
          onClick={() =>
            setActiveIndex((prev) => {
              const next = (prev + 1) % ads.length;
              trackImpression(ads[next]._id);
              return next;
            })
          }
          aria-label="Next"
        >
          <ChevronRight size={24} color="white" />
        </button>

        {/* Indicators */}
        <div className="ad-indicators d-flex justify-content-center mt-3">
          {ads.map((_, idx) => (
            <button
              key={idx}
              className={`indicator-btn ${idx === activeIndex ? 'active' : ''}`}
              onClick={() => {
                setActiveIndex(idx);
                trackImpression(ads[idx]._id);
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdSection;
