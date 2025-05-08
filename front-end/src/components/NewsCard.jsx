import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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

    const getYouTubeVideoId = (url) => {
        try {
            const parsedUrl = new URL(url);
            if (parsedUrl.hostname.includes("youtube.com")) {
                return parsedUrl.searchParams.get("v");
            } else if (parsedUrl.hostname.includes("youtu.be")) {
                return parsedUrl.pathname.split("/").pop();
            }
        } catch (err) {
            console.error("Invalid YouTube URL:", url);
        }
        return null;
    };

    const getYouTubeThumbnail = (url) => {
        const videoId = getYouTubeVideoId(url);
        return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
    };

    return (
        <div className="row g-4 bg-white mt-3">
            {news.map((item) => {
                const isYouTube = item.media?.includes("youtube.com") || item.media?.includes("youtu.be");
                const thumbnail = isYouTube ? getYouTubeThumbnail(item.media) : item.media;

                return (
                    <motion.div
                        key={item._id}
                        className="col-12 col-sm-6 col-md-4 col-lg-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <motion.div
                            className="card news-card h-100 shadow-sm bg-white border border-black"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            {thumbnail && (
                                <div className="position-relative">
                                    <motion.img
                                        src={thumbnail}
                                        className="card-img-top news-image"
                                        alt={item.title}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.4, delay: 0.2 }}
                                    />
                                    {isYouTube && (
                                        <div
                                            className="position-absolute bottom-0 start-0 p-1 px-2 text-white small fw-semibold"
                                            style={{
                                                backgroundColor: "rgba(250, 0, 0, 0.91)",
                                                borderTopRightRadius: "4px",
                                            }}
                                        >
                                            YouTube Video
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="card-body d-flex flex-column">
                                <motion.h5
                                    className="card-title text-black fw-bold"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3, delay: 0.3 }}
                                >
                                    {item.title}
                                </motion.h5>
                                <motion.p
                                    className="card-text flex-grow-1 text-muted-dark"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3, delay: 0.4 }}
                                >
                                    {item.content.slice(0, 100)}...
                                </motion.p>
                                <Link to={`/news/${item._id}`} className="btn btn-outline-dark mt-auto">
                                    View More &raquo;
                                </Link>
                            </div>
                            <div className="card-footer d-flex flex-column flex-md-row justify-content-between small text-muted bg-white">
                                <span>By {item?.author?.username ?? "Unknown"}</span>
                                <span>{formatDate(item.date)}</span>
                            </div>
                        </motion.div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default NewsCard;
