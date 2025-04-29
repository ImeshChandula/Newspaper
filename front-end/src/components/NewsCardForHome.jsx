import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./css/NewsCard.css";

const NewsCardForHome = ({ news }) => {
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
            {news.map((item) => (
                <motion.div
                    key={item._id}
                    className="col-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <motion.div
                        className="card news-card h-100 shadow-sm"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        {item.media && (
                            <motion.img
                                src={item.media}
                                className="card-img-top news-image"
                                alt={item.title}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                            />
                        )}
                        <div className="card-body d-flex flex-column">
                            <motion.h5
                                className="card-title"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.3 }}
                            >
                                {item.title}
                            </motion.h5>
                            <motion.p
                                className="card-text flex-grow-1"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.4 }}
                            >
                                {item.content.slice(0, 100)}...
                            </motion.p>
                            <Link to={`/news/${item._id}`} className="btn btn-outline-primary mt-auto">
                                View More &raquo;
                            </Link>
                        </div>
                        <div className="card-footer d-flex justify-content-between small text-muted">
                            <span>By {item?.author?.username ?? "Unknown"}</span>
                            <span>{formatDate(item.date)}</span>
                        </div>
                    </motion.div>
                </motion.div>
            ))}
        </div>
    );
};

export default NewsCardForHome;
