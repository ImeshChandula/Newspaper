import React, { useEffect, useState } from "react";
import axios from "axios";
import NewsCard from "../components/NewsCard";

const Home = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const latestNews = news;
  const politicsNews = news.filter((item) => item.category === "Politics");
  const sportsNews = news.filter((item) => item.category === "Sports");

  return (
    <div className="container py-5">
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row d-flex justify-content-center">
          {/* Latest News Section */}
          <div className="col-md-4 mb-4 d-flex flex-column align-items-center">
            <div className="category-section">
              <h4 className="category-title text-center">🆕 Latest News</h4>
              {latestNews.map((item) => (
                <div key={item._id} className="news-item">
                  <NewsCard news={[item]} />
                </div>
              ))}
            </div>
          </div>

          {/* Politics Section */}
          <div className="col-md-4 mb-4 d-flex flex-column align-items-center">
            <div className="category-section">
              <h4 className="category-title text-center">Politics</h4>
              {politicsNews.map((item) => (
                <div key={item._id} className="news-item">
                  <NewsCard news={[item]} />
                </div>
              ))}
            </div>
          </div>

          {/* Sports Section */}
          <div className="col-md-4 mb-4 d-flex flex-column align-items-center">
            <div className="category-section">
              <h4 className="category-title text-center">Sports</h4>
              {sportsNews.map((item) => (
                <div key={item._id} className="news-item">
                  <NewsCard news={[item]} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
