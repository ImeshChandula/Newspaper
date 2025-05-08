import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./css/NewsCard.css";

const NewsCardForHome = ({ news }) => {
    const formatDate = (date) =>
        new Date(date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    const getYouTubeVideoId = (url) => {
        try {
            const parsed = new URL(url);
            return parsed.hostname.includes("youtu.be")
                ? parsed.pathname.slice(1)
                : parsed.searchParams.get("v");
        } catch {
            return null;
        }
    };

    const getYouTubeThumbnail = (url) => {
        const id = getYouTubeVideoId(url);
        return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
    };

    const getGoogleDriveFileId = (url) => {
        const match = url.match(/(?:file\/d\/|open\?id=)([\w-]+)/);
        return match ? match[1] : null;
    };

    const getGoogleDriveEmbedUrl = (url) => {
        const fileId = getGoogleDriveFileId(url);
        return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : null;
    };

    const getGoogleDriveThumbnail = (url) => {
        const fileId = getGoogleDriveFileId(url);
        return fileId ? `https://drive.google.com/thumbnail?id=${fileId}` : null;
    };

    return (
        <div className="row g-4 bg-white mt-0">
            {news.map(({ _id, title, content, media, author, date }) => {
                const isYouTube = media?.includes("youtube.com") || media?.includes("youtu.be");
                const isDrive = media?.includes("drive.google.com");
                const isDriveVideo = isDrive && !media.match(/\.(jpg|jpeg|png|gif|webp)$/i);

                const thumbnail = isYouTube
                    ? getYouTubeThumbnail(media)
                    : isDrive && !isDriveVideo
                        ? getGoogleDriveThumbnail(media)
                        : media;

                return (
                    <motion.div
                        key={_id}
                        className="col-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <motion.div
                            className="card news-card h-100 shadow-sm bg-white border border-black"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            {media && (
                                <div className="position-relative">
                                    {isDriveVideo ? (
                                        <iframe
                                            src={getGoogleDriveEmbedUrl(media)}
                                            title={title}
                                            className="w-100"
                                            height="200"
                                            allow="autoplay"
                                            allowFullScreen
                                            style={{ border: "none" }}
                                        />
                                    ) : (
                                        <motion.img
                                            src={thumbnail}
                                            alt={title}
                                            className="card-img-top news-image"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.4, delay: 0.2 }}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "/fallback.jpg";
                                            }}
                                        />
                                    )}
                                    {(isYouTube || isDrive) && (
                                        <div
                                            className="position-absolute bottom-0 start-0 p-1 px-2 text-white small fw-semibold"
                                            style={{
                                                backgroundColor: isYouTube
                                                    ? "rgba(250, 0, 0, 0.91)"
                                                    : "rgba(66, 133, 244, 0.9)",
                                                borderTopRightRadius: "4px",
                                            }}
                                        >
                                            {isYouTube
                                                ? "YouTube Video"
                                                : isDriveVideo
                                                    ? "Google Drive"
                                                    : ""}
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
                                    {title}
                                </motion.h5>
                                <motion.p
                                    className="card-text flex-grow-1 text-muted-dark"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3, delay: 0.4 }}
                                >
                                    {content.slice(0, 100)}...
                                </motion.p>
                                <Link to={`/news/${_id}`} className="btn btn-outline-dark mt-auto">
                                    View More &raquo;
                                </Link>
                            </div>

                            <div className="card-footer d-flex flex-column flex-md-row justify-content-between small text-muted bg-white">
                                <span>By {author?.username ?? "Unknown"}</span>
                                <span>{formatDate(date)}</span>
                            </div>
                        </motion.div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default NewsCardForHome;
