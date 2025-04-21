import React, { useEffect, useState } from "react";
import axios from "axios";

const HistoryOfArticle = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "accept":
        return "success";
      case "reject":
        return "danger";
      case "pending":
      default:
        return "secondary";
    }
  };

  const fetchUserArticles = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to view your articles.");
        setLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:5000/api/news/myArticles", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setArticles(response.data || []);
    } catch (err) {
      console.error("Error fetching articles:", err);
      setError("Failed to fetch your articles. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserArticles();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">📰 My News Article History</h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : articles.length === 0 ? (
        <div className="alert alert-info text-center">No articles submitted yet.</div>
      ) : (
        <div className="row">
          {articles.map((article) => (
            <div key={article._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm border-0">
                {article.media && (
                  <img
                    src={article.media}
                    className="card-img-top"
                    alt={article.title}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{article.title}</h5>
                  <p className="card-text">
                    <strong>Category:</strong> {article.category}
                  </p>
                  <p className="card-text">
                    <strong>Status:</strong>{" "}
                    <span className={`badge bg-${getStatusBadgeColor(article.status)}`}>
                      {article.status.toUpperCase()}
                    </span>
                  </p>
                  <p className="card-text mt-auto">
                    <small className="text-muted">
                      Submitted on {new Date(article.date).toLocaleString()}
                    </small>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryOfArticle;
