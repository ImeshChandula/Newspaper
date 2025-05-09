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

      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL_NEWS}/myArticles`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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

  // Extracts media thumbnail from YouTube or Google Drive, else return original or placeholder
  const getMediaThumbnail = (mediaUrl) => {
    if (!mediaUrl) return "https://via.placeholder.com/400x200?text=No+Image";

    // YouTube Thumbnail
    const youtubeRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/;
    const youtubeMatch = mediaUrl.match(youtubeRegex);
    if (youtubeMatch && youtubeMatch[1]) {
      return `https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg`;
    }

    // Google Drive Thumbnail
    const driveRegex = /(?:drive\.google\.com\/file\/d\/|open\?id=)([\w-]+)/;
    const driveMatch = mediaUrl.match(driveRegex);
    if (driveMatch && driveMatch[1]) {
      return `https://drive.google.com/thumbnail?id=${driveMatch[1]}`;
    }

    // Default: image or fallback
    return mediaUrl;
  };

  return (
    <div className="container bg-white">
      <h2 className="news-head text-black">📰 My News Article History</h2>

      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-black" role="status" />
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : articles.length === 0 ? (
        <div className="alert alert-info text-center">No articles submitted yet.</div>
      ) : (
        <div className="row gy-4 gx-4 py-2">
          {articles.map((article) => (
            <div key={article._id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border border-black bg-white text-black">
                <img
                  src={getMediaThumbnail(article.media)}
                  className="card-img-top"
                  alt={article.title}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column px-3 py-3">
                  <h5 className="card-title fw-bold text-decoration-underline">{article.title}</h5>
                  <p className="card-text mb-2">
                    <strong>Category:</strong> {article.category}
                  </p>
                  <p className="card-text mb-2">
                    <strong>Status:</strong>{" "}
                    <span className={`badge bg-${getStatusBadgeColor(article.status)}`}>
                      {article.status.toUpperCase()}
                    </span>
                  </p>
                  {article.description && (
                    <p className="card-text mb-2">
                      <strong>Description:</strong> {article.description}
                    </p>
                  )}
                </div>
                <div className="card-footer d-flex flex-column flex-md-row justify-content-between small text-muted bg-white">
                  Submitted on {new Date(article.date).toLocaleString()}
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
