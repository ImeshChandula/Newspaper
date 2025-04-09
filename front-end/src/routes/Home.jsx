import React, { useEffect, useState } from "react";
import axios from "axios";
import NewsCard from "../components/NewsCard";
import "../components/css/Home.css"; // Custom styles

const Home = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL_NEWS}/accept`
        );
        setNews(response.data);
      } catch (error) {
        console.error("Failed to fetch news", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const latestNews = news;
  const politicsNews = news.filter((item) => item.category === "Politics");
  const sportsNews = news.filter((item) => item.category === "Sports");

  return (
    <div className="home-container">
      {loading ? (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading news...</p>
        </div>
      ) : (
        <div className="news-grid">
          {/* Latest News */}
          <div className="news-column">
            <h3 className="category-title">🆕 Latest News</h3>
            {latestNews.map((item) => (
              <div key={item._id} className="news-card-wrapper">
                <NewsCard news={[item]} />
              </div>
            ))}
          </div>

          {/* Politics */}
          <div className="news-column">
            <h3 className="category-title">🏛️ Politics</h3>
            {politicsNews.map((item) => (
              <div key={item._id} className="news-card-wrapper">
                <NewsCard news={[item]} />
              </div>
            ))}
          </div>

          {/* Sports */}
          <div className="news-column">
            <h3 className="category-title">🏅 Sports</h3>
            {sportsNews.map((item) => (
              <div key={item._id} className="news-card-wrapper">
                <NewsCard news={[item]} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
