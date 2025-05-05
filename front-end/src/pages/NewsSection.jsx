import React, { useEffect, useState } from "react";
import axios from "axios";
import NewsCard from "../components/NewsCard";
import { motion } from "framer-motion";

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleNewsCount, setVisibleNewsCount] = useState(4);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchRecentlyNewsWithoutBreakingNews();
    //fetchNews();
  }, []);

  const fetchRecentlyNewsWithoutBreakingNews = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get('http://localhost:5000/api/news/getAllRecentlyNewsWithoutBreakingNews', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("API Response:", res.data);
      setNews(res.data);
    } catch (error) {
      console.error('Error fetching Reject news:', error);
    } finally {
      setLoading(false);
    }
  };

  /*
  const fetchNews = async () => {
    try {
      const [acceptRes, breakingRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_BASE_URL_NEWS}/getAllRecentlyNewsWithoutBreakingNews`),
        axios.get("http://localhost:5000/api/news/breakingNews")
      ]);

      const acceptedNews = acceptRes.data;
      const breakingNews = breakingRes.data;

      const breakingNewsIds = new Set(breakingNews.map(item => item._id));
      const filteredNews = acceptedNews.filter(item => !breakingNewsIds.has(item._id));

      setNews(filteredNews);
    } catch (error) {
      console.error("Failed to fetch news", error);
    } finally {
      setLoading(false);
    }
  };*/

  const handleToggle = () => {
    if (isExpanded) {
      setVisibleNewsCount(4);
      setIsExpanded(false);
    } else {
      setVisibleNewsCount(news.length);
      setIsExpanded(true);
    }
  };

  return (
    <div className="container bg-white text-black mt-4 pb-0 mb-0">
      <motion.h2
        className="border-bottom pb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🆕 Recently Published
      </motion.h2>

      <div className="row g-4">
        {loading ? (
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="spinner-border text-black" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </motion.div>
        ) : news.length === 0 ? (
          <motion.p
            className="text-center text-black"
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

      {news.length > 4 && (
        <motion.div
          className="text-end mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <button className="btn btn-link" onClick={handleToggle}>
            {isExpanded ? "Hide" : "Show More"}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default NewsSection;
