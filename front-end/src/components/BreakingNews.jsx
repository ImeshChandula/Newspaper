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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 576) setVisibleItems(1);
      else if (window.innerWidth < 992) setVisibleItems(2);
      else setVisibleItems(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

  useEffect(() => {
    if (loading || news.length <= visibleItems) return;
    const startAutoplay = () => {
      autoplayRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex < news.length - visibleItems ? prevIndex + 1 : 0
        );
      }, 3000);
    };
    startAutoplay();

    const slider = sliderRef.current;
    const pause = () => clearInterval(autoplayRef.current);
    const resume = () => {
      pause();
      startAutoplay();
    };

    if (slider) {
      slider.addEventListener("mouseenter", pause);
      slider.addEventListener("mouseleave", resume);
      slider.addEventListener("touchstart", pause, { passive: true });
      slider.addEventListener("touchend", resume, { passive: true });

      return () => {
        clearInterval(autoplayRef.current);
        slider.removeEventListener("mouseenter", pause);
        slider.removeEventListener("mouseleave", resume);
        slider.removeEventListener("touchstart", pause);
        slider.removeEventListener("touchend", resume);
      };
    }
  }, [loading, news, visibleItems]);

  const handlePrev = () => {
    clearInterval(autoplayRef.current);
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    clearInterval(autoplayRef.current);
    setCurrentIndex((prev) => Math.min(prev + 1, news.length - visibleItems));
  };

  const jumpToSlide = (index) => {
    clearInterval(autoplayRef.current);
    setCurrentIndex(index);
  };

  const formatDate = (iso) => {
    const date = new Date(iso);
    return date.toLocaleDateString(undefined, {
      year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  if (loading) return <div className="breaking-news py-4 text-light">Loading Breaking News...</div>;
  if (news.length === 0) return null;

  return (
    <div className="container text-light">
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
          <div className="slider-controls d-none d-md-block">
            <button
              className="btn btn-sm btn-outline-light me-2"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            <button
              className="btn btn-sm btn-outline-light"
              onClick={handleNext}
              disabled={currentIndex >= news.length - visibleItems}
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
                className="card news-card h-100 bg-secondary text-light"
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
                    className="card-title fs-6 fs-md-5 fw-bold text-dark"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    {item.title}
                  </motion.h5>
                  <motion.p
                    className="card-text flex-grow-1 small text-dark"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    {item.content.slice(0, 100)}...
                  </motion.p>
                  <Link to={`/news/${item._id}`} className="btn btn-sm btn-outline-light mt-auto">
                    View More &raquo;
                  </Link>
                </div>
                <div className="card-footer d-flex flex-column flex-md-row justify-content-between small text-white bg-dark">
                  <span className="mb-1 mb-md-0">By {item?.author?.username ?? "Unknown"}</span>
                  <span >{formatDate(item.date)}</span>
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
                  background: idx === currentIndex ? "#0d6efd" : "#888",
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
