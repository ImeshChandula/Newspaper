import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Spinner } from "react-bootstrap";
import ShareButton from "./ShareButton";
import "../components/css/Home.css"

const NewsDetail = () => {
    const { id } = useParams();
    const [newsItem, setNewsItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Hook to navigate to previous page

    const getYouTubeEmbedUrl = (url) => {
        try {
            const parsedUrl = new URL(url);
            if (parsedUrl.hostname.includes("youtube.com")) {
                const videoId = parsedUrl.searchParams.get("v");
                if (videoId) return `https://www.youtube.com/embed/${videoId}`;
            } else if (parsedUrl.hostname.includes("youtu.be")) {
                const videoId = parsedUrl.pathname.split("/").pop();
                if (videoId) return `https://www.youtube.com/embed/${videoId}`;
            }
        } catch (err) {
            console.error("Invalid YouTube URL:", url);
        }
        return url;
    };

    useEffect(() => {
        const fetchNewsItem = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL_NEWS}/getNewsArticleByID/${id}`);
                setNewsItem(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching news item:", error);
                setLoading(false);
            }
        };

        fetchNewsItem();
    }, [id]);

    if (loading) {
        return (
            <div className="container vh-100 mt-5 text-center py-5">
                <Spinner animation="border" role="status" className="mt-5">
                    <span className="visually-hidden mt-5">Loading...</span>
                </Spinner>
                <h4 className="mt-3">Loading News...</h4>
            </div>
        );
    }

    if (!newsItem) {
        return (
            <motion.div
                className="container mt-5 text-center py-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h4 className="mt-5 py-2">News not found</h4>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="py-5 mt-5"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <div className="row justify-content-center">
                <motion.div
                    className="col-12 col-md-10 col-lg-8"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {/* Only visible on large displays. */}
                    <div className="row d-none d-lg-flex d-md-flex align-items-center mb-4 mt-5">
                        <div className="col-lg-1 d-flex justify-content-start">
                            <button onClick={() => navigate(-1)} className="btn btn-outline-dark">
                                &lt;
                            </button>
                        </div>

                        <div className="col-lg-10">
                            <motion.h1
                                className="mb-3 text-center text-black"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                            >
                                {newsItem.title}
                            </motion.h1>
                        </div>

                        <div className="col-lg-1 d-flex justify-content-end">
                            <ShareButton url={window.location.href} title={newsItem.title} />
                        </div>
                    </div>

                    {/* Only visible on small displays. */}
                    <div className="d-block d-md-none mt-5">
                        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between mb-4 gap-2">
                            <div className="d-flex justify-content-between w-100 w-md-auto">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="btn btn-outline-dark"
                                >
                                    &lt;
                                </button>
                                <ShareButton url={window.location.href} title={newsItem.title} />
                            </div>

                            <motion.h1
                                className="text-center flex-grow-1 mb-2 text-black"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                            >
                                {newsItem.title}
                            </motion.h1>
                        </div>
                    </div>

                    {newsItem.media && (
                        newsItem.media.includes("youtube.com") || newsItem.media.includes("youtu.be") ? (
                            <motion.div
                                className="ratio ratio-16x9"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                            >
                                <iframe
                                    className="card-img-top"
                                    src={getYouTubeEmbedUrl(newsItem.media)}
                                    title={newsItem.title}
                                    allowFullScreen
                                />

                            </motion.div>
                        ) : (
                            <motion.img
                                src={newsItem.media}
                                className="card-img-top news-image"
                                alt={newsItem.title}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                            />
                        )
                    )}

                    <motion.div
                        className="lead text-black mt-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                    >
                        {newsItem.content
                            .split(/\r?\n/)
                            .filter(paragraph => paragraph.trim() !== "")
                            .map((paragraph, index) => (
                                <p key={index} className="mb-3 text-justify">
                                    {paragraph}
                                </p>
                            ))}
                    </motion.div>

                    <motion.div
                        className="d-flex justify-content-between flex-wrap small text-black mt-4 border-top pt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.4 }}
                    >
                        <span>
                            <strong>Author:</strong> {newsItem?.author?.username ?? "Unknown"}
                        </span>
                        <span>
                            <strong>Published:</strong> {new Date(newsItem.date).toLocaleString()}
                        </span>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default NewsDetail;
