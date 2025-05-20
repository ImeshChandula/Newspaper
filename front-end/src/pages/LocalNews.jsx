import React, { useEffect, useState } from "react";
import axios from "axios";
import NewsCard from "../components/NewsCard";
import { motion } from "framer-motion";

const LocalNews = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL_NEWS}/local/accept`);
        setNews(response.data);
        setFilteredNews(response.data);
      } catch (error) {
        console.error("Failed to fetch news", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleFilterChange = (e) => {
    const selectedDate = e.target.value;
    setFilterDate(selectedDate);

    if (!selectedDate) {
      setFilteredNews(news);
    } else {
      const filtered = news.filter((item) => {
        const itemDate = new Date(item.date).toISOString().split("T")[0];
        return itemDate === selectedDate;
      });
      setFilteredNews(filtered);
    }
  };

  const resetFilter = () => {
    setFilterDate("");
    setFilteredNews(news);
  };

  return (
    <div className="container home-page bg-white py-5 mt-5">
      <motion.h2
        className="border-bottom pb-2 text-black mt-3 mt-sd-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🌐 Local News
      </motion.h2>

      <div className="row mb-4">
        <div className="col-md-3">
          <label className="form-label fw-semibold text-black">Filter by Date:</label>
          <input
            type="date"
            className="form-control border-dark"
            value={filterDate}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-md-6 d-flex align-items-end">
          <button className="btn btn-outline-secondary ms-md-3 mt-3 mt-md-0" onClick={resetFilter}>
            Reset Filter
          </button>
        </div>
      </div>

      <div className="container">
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
        ) : filteredNews.length === 0 ? (
          <motion.p
            className="text-center text-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            No news available for the selected date.
          </motion.p>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <NewsCard news={filteredNews} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LocalNews;
