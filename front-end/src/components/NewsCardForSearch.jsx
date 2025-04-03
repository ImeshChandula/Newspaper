import React from "react";
import "./css/NewsCard.css";

const NewsCard = ({ news, showDetails = false }) => {
    const { title, image, description, timestamp, tags } = news;

    const getTimeAgo = (timestamp) => {
        const now = new Date().getTime();
        const diff = now - timestamp;

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);

        if (seconds < 60) return "Just now";
        if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
        if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
        if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;

        return "Over a year ago";
    };

    const isLatest = new Date().getTime() - timestamp <= 10 * 60 * 1000; // Within 10 minutes

    return (
        <div className="card news-card">
            <div className="row">
                <div className="col-4">
                    <img src={image} className="card-img-top news-image" alt={title} />
                </div>
                <div className="col-8">
                    <div className="card-body">
                        <h5 className="card-title">{title}</h5>
                        {isLatest && <span className="badge bg-danger latest-badge">Latest</span>}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="card-body">
                    <p className="card-text">{description}</p>
                    <a className="btn btn-link p-0">View more &gt;&gt;</a>
                    <div className="text-muted small mt-1">{getTimeAgo(timestamp)}</div>
                </div>
            </div>
        </div>
    );
};

export default NewsCard;
