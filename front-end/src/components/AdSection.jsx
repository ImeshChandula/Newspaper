import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const AdSection = () => {
  const [ads, setAds] = useState([]);
  const [error, setError] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const impressionSet = useRef(new Set());
  const carouselRef = useRef(null);
  const token = localStorage.getItem('token');

  // Swipe tracking
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const fetchAds = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL_ADS}/getAllActiveAds`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ads.length) return;

    // Track first ad
    if (ads[0]) {
      trackImpression(ads[0]._id);
    }

    const autoplayInterval = setInterval(() => {
      setActiveIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % ads.length;
        if (ads[nextIndex]) {
          trackImpression(ads[nextIndex]._id);
        }
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(autoplayInterval);
  }, [ads]);

  useEffect(() => {
    const carouselNode = carouselRef.current;
    if (!carouselNode || !ads.length) return;

    const items = carouselNode.querySelectorAll('.carousel-item');
    items.forEach(item => item.classList.remove('active'));
    if (items[activeIndex]) items[activeIndex].classList.add('active');

    const indicators = carouselNode.querySelectorAll('.carousel-indicators button');
    indicators.forEach((indicator, idx) => {
      indicator.classList.toggle('active', idx === activeIndex);
      indicator.setAttribute('aria-current', idx === activeIndex ? 'true' : 'false');
    });
  }, [activeIndex, ads]);

  useEffect(() => {
    if (ads.length) {
      const timer = setTimeout(() => setCollapsed(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [ads]);

  // Swipe event handlers
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
        // Swipe left → next
        setActiveIndex(prevIndex => {
          const newIndex = (prevIndex + 1) % ads.length;
          trackImpression(ads[newIndex]._id);
          return newIndex;
        });
      } else {
        // Swipe right → previous
        setActiveIndex(prevIndex => {
          const newIndex = prevIndex === 0 ? ads.length - 1 : prevIndex - 1;
          trackImpression(ads[newIndex]._id);
          return newIndex;
        });
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

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

  const extractDriveFileId = (url) => {
    const match = url.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]{10,})/);
    return match ? match[1] : null;
  };

  const getGoogleDriveThumbnail = (url, isVideo = false) => {
    const fileId = extractDriveFileId(url);
    if (!fileId) return url;

    return isVideo
      ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`
      : `https://drive.google.com/thumbnail?id=${fileId}`;
  };

  const isGoogleDriveLink = (url) => /drive\.google\.com/.test(url);

  const isVideoFile = (url) =>
    /\.(mp4|webm|ogg)$/i.test(url) || url.includes('video');


  return (
    <div className="container-fluid pt-5 mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-dark mb-0">📢 Sponsored Ads</h3>
        <button
          className="btn btn-sm btn-outline-dark"
          onClick={() => setCollapsed(true)}
        >
          Collapse
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div
        id="adsCarousel"
        className="carousel slide position-relative"
        style={{ height: '220px' }}
        ref={carouselRef}
      >
        {/* Indicators */}
        <div className="carousel-indicators mb-0">
          {ads.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setActiveIndex(idx);
                trackImpression(ads[idx]._id);
              }}
              className={idx === activeIndex ? 'active' : ''}
              aria-current={idx === activeIndex ? 'true' : undefined}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Carousel Items with swipe support */}
        <div
          className="carousel-inner h-100 rounded-3 overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {ads.map((ad, idx) => (
            <div
              key={ad._id}
              className={`carousel-item h-100 ${idx === activeIndex ? 'active' : ''}`}
            >
              <div className="h-100 d-flex justify-content-center align-items-center">
                <div
                  className="card text-white w-100 h-100 mx-2 border-0 shadow-lg"
                  style={{
                    background: `url(${isGoogleDriveLink(ad.media)
                      ? getGoogleDriveThumbnail(ad.media, isVideoFile(ad.media))
                      : ad.media
                      }) center/cover no-repeat`,
                    borderRadius: '1rem',
                  }}
                >
                  <div
                    className="card-img-overlay d-flex flex-column justify-content-end p-3"
                    style={{
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
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
                        fontSize: '0.9rem',
                      }}
                    >
                      {ad.content}
                    </p>
                    <button
                      className="btn btn-sm btn-light mt-2 align-self-start"
                      onClick={(e) => handleVisitClick(e, ad)}
                    >
                      Visit Link
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <button
          className="carousel-control-prev d-none d-md-flex d-lg-flex"
          type="button"
          onClick={() =>
            setActiveIndex((prevIndex) => {
              const newIndex = prevIndex === 0 ? ads.length - 1 : prevIndex - 1;
              trackImpression(ads[newIndex]._id);
              return newIndex;
            })
          }
          style={{ width: "50px", height: "50px", marginLeft: "50px", marginTop: "75px" }}
        >
          <span className="carousel-control-prev-icon bg-dark rounded-circle p-2" aria-hidden="true" />
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next d-none d-md-flex d-lg-flex"
          type="button"
          onClick={() =>
            setActiveIndex((prevIndex) => {
              const newIndex = (prevIndex + 1) % ads.length;
              trackImpression(ads[newIndex]._id);
              return newIndex;
            })
          }
          style={{ width: "50px", height: "50px", marginRight: "50px", marginTop: "75px" }}
        >
          <span className="carousel-control-next-icon bg-dark rounded-circle p-2" aria-hidden="true" />
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};

export default AdSection;
