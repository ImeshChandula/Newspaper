import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./css/BreakingNews.css";

const BreakingNews = () => {
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(3);
  const sliderRef = useRef(null);
  const autoplayRef = useRef(null);

  // Handle responsive layout changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 576) {
        setVisibleItems(1); // Mobile: show one item
      } else if (window.innerWidth < 992) {
        setVisibleItems(2); // Tablet: show two items
      } else {
        setVisibleItems(3); // Desktop: show three items
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchBreakingNews = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/news/breakingNews");
        setNews(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching breaking news:", err);
        setLoading(false);
      }
    };

    fetchBreakingNews();
  }, []);


  // Set up auto-sliding
  useEffect(() => {
    if (loading || news.length <= visibleItems) return;
    
    // Start autoplay timer
    const startAutoplay = () => {
      autoplayRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => {
          const nextIndex = prevIndex + 1;
          // Loop back to the beginning when reaching the end
          return nextIndex < news.length - visibleItems + 1 ? nextIndex : 0;
        });
      }, 3000); // Change slide every 03 seconds
    };
    
    startAutoplay();
    
    // Pause autoplay on hover and touch
    const sliderElement = sliderRef.current;
    if (sliderElement) {
      const pauseAutoplay = () => {
        if (autoplayRef.current) clearInterval(autoplayRef.current);
      };
      
      const resumeAutoplay = () => {
        pauseAutoplay();
        startAutoplay();
      };
      
      sliderElement.addEventListener('mouseenter', pauseAutoplay);
      sliderElement.addEventListener('mouseleave', resumeAutoplay);
      sliderElement.addEventListener('touchstart', pauseAutoplay, { passive: true });
      sliderElement.addEventListener('touchend', resumeAutoplay, { passive: true });
      
      // Clean up
      return () => {
        if (autoplayRef.current) clearInterval(autoplayRef.current);
        if (sliderElement) {
          sliderElement.removeEventListener('mouseenter', pauseAutoplay);
          sliderElement.removeEventListener('mouseleave', resumeAutoplay);
          sliderElement.removeEventListener('touchstart', pauseAutoplay);
          sliderElement.removeEventListener('touchend', resumeAutoplay);
        }
      };
    }
    
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [loading, news, visibleItems]);

  const handlePrev = () => {
    // Clear the autoplay when manually navigating
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    // Clear the autoplay when manually navigating
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, news.length - visibleItems));
  };

  const jumpToSlide = (index) => {
    // Clear the autoplay when manually navigating
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    setCurrentIndex(index);
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // If still loading, show loading indicator
  if (loading) {
    return <div className="breaking-news py-4">Loading Breaking News...</div>;
  }

  // If there's no news, return null to hide the entire section
  if (news.length === 0) {
    return null;
  }
  

  return (
    <div className="container my-4 my-md-5 px-3 px-md-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 mb-md-4">
        <motion.h2
          className="border-bottom pb-2 mb-3 mb-md-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          📰 Breaking News
        </motion.h2>
        
        {news.length > visibleItems && (
          <div className="slider-controls">
            <button 
              className="btn btn-sm btn-outline-dark me-2" 
              onClick={handlePrev}
              disabled={currentIndex === 0}
              aria-label="Previous slide"
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            <button 
              className="btn btn-sm btn-outline-dark" 
              onClick={handleNext}
              disabled={currentIndex >= news.length - visibleItems}
              aria-label="Next slide"
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        )}
      </div>

      <div className="news-slider position-relative overflow-hidden">
        <motion.div 
          className="slider-track d-flex"
          ref={sliderRef}
          style={{ 
            transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
            transition: "transform 0.5s ease"
          }}
        >
          {news.map((item) => (
            <div 
              key={item._id} 
              className="slider-item px-2" 
              style={{ flex: `0 0 ${100 / visibleItems}%` }}
            >
              <motion.div
                className="card news-card h-100 shadow-sm"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                {item.media && (
                  <motion.img
                    src={item.media}
                    className="card-img-top news-image"
                    alt={item.title}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <motion.h5
                    className="card-title fs-6 fs-md-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    {item.title}
                  </motion.h5>
                  <motion.p
                    className="card-text flex-grow-1 small"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    {item.content.slice(0, 100)}...
                  </motion.p>
                  <Link to={`/news/${item._id}`} className="btn btn-sm btn-outline-primary mt-auto">
                    View More &raquo;
                  </Link>
                </div>
                <div className="card-footer d-flex flex-column flex-md-row justify-content-between small text-muted">
                  <span className="mb-1 mb-md-0">By {item?.author?.username ?? "Unknown"}</span>
                  <span>{formatDate(item.date)}</span>
                </div>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>

      {news.length > visibleItems && (
        <motion.div 
          className="pagination mt-3 d-flex justify-content-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="page-indicators">
            {Array.from({ length: Math.max(1, news.length - visibleItems + 1) }).map((_, idx) => (
              <button
                key={idx}
                className={`indicator-dot mx-1 ${idx === currentIndex ? "active" : ""}`}
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  border: "none",
                  background: idx === currentIndex ? "#0d6efd" : "#dee2e6",
                  cursor: "pointer"
                }}
                onClick={() => jumpToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BreakingNews;
