import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const AdSection = () => {

    const [ads, setAds] = useState([]);
    const [error, setError] = useState('');
    const [collapsed, setCollapsed] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const impressionSet = useRef(new Set());
    const carouselRef = useRef(null);
    // eslint-disable-next-line no-unused-vars
    const carouselInstance = useRef(null);
  
    const token = localStorage.getItem('token');
  
    const fetchAds = async () => {
      try {
        const { data } = await axios.get(
          'http://localhost:5000/api/ads/getAllActiveAds',
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
        await axios.patch(`http://localhost:5000/api/ads/trackAdImpression/${adId}`);
      } catch (err) {
        console.error('Error tracking impression:', err.message);
      }
    };
  
    const handleVisitClick = async (e, ad) => {
      e.preventDefault();
      try {
        await axios.patch(`http://localhost:5000/api/ads/trackAdClick/${ad._id}`);
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
  
    // Custom autoplay implementation
    useEffect(() => {
      if (!ads.length) return;
      
      // Track initial impression
      if (ads[0]) {
        trackImpression(ads[0]._id);
      }
      
      // Set up interval for autoplay
      const autoplayInterval = setInterval(() => {
        setActiveIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % ads.length;
          if (ads[nextIndex]) {
            trackImpression(ads[nextIndex]._id);
          }
          return nextIndex;
        });
      }, 3000); // 3 seconds between slides
      
      return () => {
        // Clean up interval on unmount
        clearInterval(autoplayInterval);
      };
    }, [ads]);
    
    // Update DOM when activeIndex changes
    useEffect(() => {
      const carouselNode = carouselRef.current;
      if (!carouselNode || !ads.length) return;
      
      // Find all carousel items
      const items = carouselNode.querySelectorAll('.carousel-item');
      
      // Remove active class from all items
      items.forEach(item => {
        item.classList.remove('active');
      });
      
      // Add active class to current item
      if (items[activeIndex]) {
        items[activeIndex].classList.add('active');
      }
      
      // Update indicators
      const indicators = carouselNode.querySelectorAll('.carousel-indicators button');
      indicators.forEach((indicator, idx) => {
        indicator.classList.toggle('active', idx === activeIndex);
        indicator.setAttribute('aria-current', idx === activeIndex ? 'true' : 'false');
      });
    }, [activeIndex, ads]);
  
    // Auto-collapse after 5 seconds
    useEffect(() => {
      if (ads.length) {
        const timer = setTimeout(() => setCollapsed(true), 5000);
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
    <div className="w-100 py-5 px-2 px-md-4 mt-4 pb-0 mb-0">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h4 className="text-black mb-0">📢 Ads</h4>
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
        className="carousel slide"
        style={{ height: '200px' }}
        ref={carouselRef}
      >
        {/* Indicators */}
        <div className="carousel-indicators">
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

        {/* Carousel Items */}
        <div className="carousel-inner h-100">
          {ads.map((ad, idx) => (
            <div
              key={ad._id}
              className={`carousel-item h-100 ${idx === activeIndex ? 'active' : ''}`}
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
                    <button
                      className="btn btn-sm btn-light mt-2 align-self-start mb-3"
                      onClick={(e) => handleVisitClick(e, ad)}
                    >
                      Visit link
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls - optional, can be removed if you don't want manual navigation */}
        <button 
          className="carousel-control-prev" 
          type="button"
          onClick={() => setActiveIndex((prevIndex) => {
            const newIndex = prevIndex === 0 ? ads.length - 1 : prevIndex - 1;
            trackImpression(ads[newIndex]._id);
            return newIndex;
          })}
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button 
          className="carousel-control-next" 
          type="button"
          onClick={() => setActiveIndex((prevIndex) => {
            const newIndex = (prevIndex + 1) % ads.length;
            trackImpression(ads[newIndex]._id);
            return newIndex;
          })}
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  )
}

export default AdSection