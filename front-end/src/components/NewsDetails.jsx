import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import newsData from "../data/data.js";

const NewsDetails = () => {
    const { title } = useParams();
    const decodedTitle = decodeURIComponent(title);
    const navigate = useNavigate();
    const newsItem = newsData.find((item) => item.title === decodedTitle);

    if (!newsItem) {
        return <div className="text-center mt-5">News item not found</div>;
    }

    const formattedDate = new Date(newsItem.timestamp).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    });

    return (
        <div className="container mt-5">
            <div className="d-flex align-items-center mb-3">
                <button
                    onClick={() => navigate(-1)}
                    className="btn btn-outline-secondary me-3"
                >
                    &larr;
                </button>
                <h2 className="mb-3">{newsItem.title}</h2>
            </div>
            <img
                src={newsItem.image}
                alt={newsItem.title}
                className="img-fluid mb-3 rounded"
                style={{ maxHeight: "400px", width: "100%", objectFit: "contain" }}
            />
            <p className="lead">{newsItem.description}</p>
            <div className="text-muted">Published on: {formattedDate}</div>
        </div>
    );
};

export default NewsDetails;
