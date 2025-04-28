import React, { useState, useEffect } from "react";
import axios from "axios";
import NewsCard from "../components/NewsCard";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const NewsSection = () => {
  const { t } = useTranslation();

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleNewsCount, setVisibleNewsCount] = useState(4);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const [acceptRes, breakingRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_BASE_URL_NEWS}/accept`),
          axios.get("http://localhost:5000/api/news/breakingNews")
        ]);

        const acceptedNews = acceptRes.data;
        const breakingNews = breakingRes.data;
        const breakingIds = new Set(breakingNews.map(item => item._id));
        setNews(acceptedNews.filter(item => !breakingIds.has(item._id)));
      } catch (error) {
        console.error("Failed to fetch news", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleToggle = () => {
    if (isExpanded) {
      setVisibleNewsCount(4);
    } else {
      setVisibleNewsCount(news.length);
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="container">
      <motion.h2
        className="border-bottom pb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {t('recentlyPublished')}
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
              <span className="visually-hidden">{t('loading')}</span>
            </div>
          </motion.div>
        ) : news.length === 0 ? (
          <motion.p
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {t('noNews')}
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
            {isExpanded ? t('hide') : t('showMore')}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default NewsSection;
