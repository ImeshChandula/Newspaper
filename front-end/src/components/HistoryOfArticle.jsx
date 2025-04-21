import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HistoryOfArticle = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyArticles = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming you store JWT in localStorage
        const response = await axios.get('http://localhost:5000/api/news/myArticles', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setArticles(response.data);
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError("Failed to load your articles.");
      }
    };

    fetchMyArticles();
  }, []);

  return (
    <div className="container mt-4">
      <h2>My News Article History</h2>
      {error && <p className="text-danger">{error}</p>}
      {articles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        <div className="row">
          {articles.map((article) => (
            <div key={article._id} className="col-md-6 mb-3">
              <div className="card shadow-sm">
                {article.media && (
                  <img src={article.media} alt={article.title} className="card-img-top" style={{ maxHeight: "200px", objectFit: "cover" }} />
                )}
                <div className="card-body">
                  <h5 className="card-title">{article.title}</h5>
                  <p className="card-text"><strong>Category:</strong> {article.category}</p>
                  <p className="card-text"><strong>Status:</strong> <span className={`badge bg-${getStatusColor(article.status)}`}>{article.status}</span></p>
                  <p className="card-text"><small className="text-muted">{new Date(article.date).toLocaleString()}</small></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Utility to get status color
const getStatusColor = (status) => {
  switch (status) {
    case "accept":
      return "success";
    case "pending":
      return "warning";
    case "reject":
      return "danger";
    default:
      return "secondary";
  }
};

export default HistoryOfArticle;
