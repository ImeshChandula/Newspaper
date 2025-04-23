import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Spinner } from "react-bootstrap";
import ShareButton from "./ShareButton";

const NewsDetail = () => {
    const { id } = useParams();
    const [newsItem, setNewsItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Hook to navigate to previous page

    useEffect(() => {
        const fetchNewsItem = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/news/getNewsArticleByID/${id}`);
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
            <div className="container mt-5 text-center py-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
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
                <h4>News not found</h4>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="container mt-4 py-5"
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
                    <div className="row">
                        <div className="col-1">
                            <button onClick={() => navigate(-1)} className="btn btn-secondary" > &lt; </button>
                        </div>
                        <div className="col-10">

                            <motion.h1
                                className="mb-3 text-center"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                            >
                                {newsItem.title}
                            </motion.h1>
                        </div>

                        <div className="col-1">
                            <ShareButton
                                url={window.location.href}
                                title={newsItem.title}
                            />
                        </div>

                    </div>

                    {newsItem.media && (
                        <motion.img
                            src={newsItem.media}
                            alt={newsItem.title}
                            className="img-fluid rounded mb-4 w-100"
                            style={{ maxHeight: "200px", objectFit: "contain" }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        />
                    )}

                    <motion.p
                        className="lead text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                    >
                        {newsItem.content}
                    </motion.p>

                    <motion.div
                        className="d-flex justify-content-between flex-wrap small text-muted mt-4 border-top pt-2"
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
