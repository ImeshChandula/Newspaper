import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL_NEWS}/getAllNews`);
        setNews(res.data.reverse());
      } catch (error) {
        console.error("Failed to fetch news", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="home-page py-5">
      <div className="container">
        {loading ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : news.length === 0 ? (
          <p className="text-center">No news available.</p>
        ) : (
          <div className="row g-4">
            {news.slice(0, 6).map((item) => (
              <div key={item._id} className="col-12 col-sm-6 col-lg-4">
                <div className="card h-100 shadow-sm border-0">
                  {item.media && (
                    <img
                      src={item.media}
                      className="card-img-top"
                      alt="News"
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text">
                      {item.content.slice(0, 100)}...
                    </p>
                  </div>
                  <div className="card-footer small text-muted">
                    By {item?.author?.username ?? "Unknown"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
