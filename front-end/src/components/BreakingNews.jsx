import React, { useEffect, useState } from "react";
import axios from "axios";
import NewsCard from "../components/NewsCard";
import { motion } from "framer-motion";

const BreakingNews = () => {
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState([]);
  const [visibleNewsCount, setVisibleNewsCount] = useState(4);

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

  if (loading) {
    return <div className="breaking-news">Loading Breaking News...</div>;
  }

  const handleShowMore = () => {
    setVisibleNewsCount(news.length);
  };

  return (
    <div className="container">
      <motion.h2
        className="border-bottom pb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        📰 Breaking News
      </motion.h2>

      <div className="row g-4">
        {loading ? (
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </motion.div>
        ) : news.length === 0 ? (
          <motion.p
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            No news available.
          </motion.p>
        ) : (
          <NewsCard news={news.slice(0, visibleNewsCount)} />
        )}
      </div>

      {visibleNewsCount < news.length && (
        <motion.div
          className="text-end mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <button className="btn btn-link" onClick={handleShowMore}>
            Show More
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default BreakingNews;
