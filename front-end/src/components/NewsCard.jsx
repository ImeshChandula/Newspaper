import React from "react";

const NewsCard = ({ title, image, description, timestamp }) => {
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

    return (
        <div className="card news-card">
            <img src={image} className="card-img-top news-image" alt={title} />
            <div className="card-body">
                <h5 className="card-title">
                    {title}
                    {new Date().getTime() - timestamp <= 10 * 60 * 1000 && (
                        <span className="badge bg-danger ms-2">Latest</span>
                    )}
                </h5>
                <p className="card-text text-muted">{description}</p>
                <a href="#" className="btn btn-link p-0">View more &gt;&gt;</a>
                <div className="text-muted small mt-1">{getTimeAgo(timestamp)}</div>
            </div>
        </div>
    );
};

export default NewsCard;
