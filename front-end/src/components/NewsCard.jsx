import React from "react";
import { Link } from "react-router-dom";
import "./css/NewsCard.css";

const NewsCard = ({ news }) => {
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="row g-4">
            {news.slice(0, 6).map((item) => (
                <div key={item._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                    <div className="card h-auto shadow-sm border-1 bg-light news-card">
                        {item.media && (
                            <img
                                src={item.media}
                                className="card-img-top news-image"
                                alt={item.title}
                            />
                        )}
                        <div className="card-body">
                            <h5 className="card-title">{item.title}</h5>
                            <p className="card-text">{item.content.slice(0, 100)}...</p>
                            <Link to={`/news/${item._id}`} className="btn btn-link">
                                View more &gt;&gt;
                            </Link>
                        </div>
                        <div className="card-footer d-flex justify-content-between small text-muted">
                            <span>By {item?.author?.username ?? "Unknown"}</span>
                            <span>{formatDate(item.date)}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NewsCard;
