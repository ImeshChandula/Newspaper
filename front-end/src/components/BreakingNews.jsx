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
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL_NEWS}/breakingNews`);
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

  // 🔧 Helpers for YouTube and Google Drive
  const getYouTubeThumbnail = (url) => {
    try {
      const id = url.includes("watch?v=")
        ? url.split("watch?v=")[1].split("&")[0]
        : url.includes("youtu.be/")
          ? url.split("youtu.be/")[1].split("?")[0]
          : "";
      return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    } catch {
      return "";
    }
  };

  const getDriveFileId = (url) => {
    const match = url.match(/(?:file\/d\/|open\?id=)([\w-]+)/);
    return match ? match[1] : null;
  };

  const getDriveThumbnail = (url) => {
    const id = getDriveFileId(url);
    return id ? `https://drive.google.com/thumbnail?id=${id}` : null;
  };

  // eslint-disable-next-line no-unused-vars
  const getDriveEmbedUrl = (url) => {
    const id = getDriveFileId(url);
    return id ? `https://drive.google.com/file/d/${id}/preview` : null;
  };

  if (loading) return <div className="breaking-news py-4 text-light">Loading Breaking News...</div>;
  if (news.length === 0) return null;

  return (
    <div className="container pb-0 mb-3">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 mb-md-4">
        <motion.h2
          className="border-bottom pb-2 mb-3 mb-md-0 text-black"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          📰 Breaking News
        </motion.h2>

        {news.length > visibleItems && (
          <div className="slider-controls d-none d-md-block mt-5">
            <button className="btn btn-sm btn-outline-dark me-2" onClick={handlePrev} disabled={currentIndex === 0}>
              <i className="bi bi-chevron-left"></i>
            </button>
            <button className="btn btn-sm btn-outline-dark" onClick={handleNext} disabled={currentIndex >= news.length - visibleItems}>
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        )}
      </div>

      <div className="news-slider position-relative overflow-hidden">
        <motion.div
          className="slider-track d-flex"
          ref={sliderRef}
          style={{ transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`, transition: "transform 0.5s ease" }}
        >
          {news.map((item) => {
            const isYouTube = item.media.includes("youtube.com") || item.media.includes("youtu.be");
            const isDrive = item.media.includes("drive.google.com");
            const isDriveVideo = isDrive && !item.media.match(/\.(jpg|jpeg|png|webp|gif)$/i);

            const mediaContent = isYouTube ? (
              <Link to={`/news/${item._id}`}>
                <img
                  src={getYouTubeThumbnail(item.media)}
                  alt={item.title}
                  className="card-img-top news-image"
                />
                <div className="position-absolute bottom-0 start-0 p-1 px-2 text-white small fw-semibold"
                  style={{ backgroundColor: "rgba(250, 0, 0, 0.91)", borderTopRightRadius: "4px" }}>
                  YouTube Video
                </div>
              </Link>
            ) : isDriveVideo ? (
              <Link to={`/news/${item._id}`}>
                <img
                  src={getDriveThumbnail(item.media)}
                  alt={item.title}
                  className="card-img-top news-image"
                />
              </Link>
            ) : (
              <img
                src={isDrive ? getDriveThumbnail(item.media) : item.media}
                className="card-img-top news-image"
                alt={item.title}
              />
            );

            return (
              <div key={item._id} className="slider-item px-2" style={{ flex: `0 0 ${100 / visibleItems}%` }}>
                <motion.div
                  className="card news-card h-100 bg-white border border-black"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="position-relative">{mediaContent}</div>
                  <div className="card-body d-flex flex-column">
                    <motion.h5
                      className="card-title fs-6 fs-md-5 fw-bold text-black"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      {item.title}
                    </motion.h5>
                    <motion.p
                      className="card-text flex-grow-1 small text-muted-dark"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                      {item.content.slice(0, 100)}...
                    </motion.p>
                    <Link to={`/news/${item._id}`} className="btn btn-sm btn-outline-dark mt-auto">
                      View More &raquo;
                    </Link>
                  </div>
                  <div className="card-footer d-flex flex-column flex-md-row justify-content-between small text-muted">
                    {/*<span className="mb-1 mb-md-0">By {item?.author?.username ?? "Unknown"}</span>*/}
                    <span>{formatDate(item.date)}</span>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {news.length > visibleItems && (
        <motion.div className="pagination mt-3 d-flex justify-content-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
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
