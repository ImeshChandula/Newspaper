import React, { useEffect, useState } from "react";
import axios from "axios";
import NewsCard from "../components/NewsCard";

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleNewsCount, setVisibleNewsCount] = useState(4); // Initially show 4 news items

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL_NEWS}/accept`);
        setNews(response.data);
      } catch (error) {
        console.error("Failed to fetch news", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleShowMore = () => {
    setVisibleNewsCount(news.length); // Set visible count to show all news
  };

  return (
    <div className="container">
      <h2 className="border-bottom pb-2">Latest News</h2>
      <div className="row g-4">
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : news.length === 0 ? (
          <p className="text-center">No news available.</p>
        ) : (
          <NewsCard news={news.slice(0, visibleNewsCount)} />
        )}
      </div>
      
      {visibleNewsCount < news.length && (
        <div className="text-end mt-4">
          <button className="btn btn-link" onClick={handleShowMore}>
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsSection;
