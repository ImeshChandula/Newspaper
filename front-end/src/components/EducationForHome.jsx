import React, { useEffect, useState } from "react";
import axios from "axios";
import NewsCardForHome from "./NewsCardForHome";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const EducationForHome = () => {

    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL_NEWS}/education/accept`);
                setNews(response.data);
            } catch (error) {
                console.error("Failed to fetch news", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const handleSeeMore = () => {
        navigate("/education");
    };

    return (
        <div className="home-page">
            <motion.h2
                className="border-bottom pb-2 text-black"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                📚 Education
            </motion.h2>

            <div className="container">
                {loading ? (
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="spinner-border text-black" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </motion.div>
                ) : news.length === 0 ? (
                    <motion.p
                        className="text-center text-black"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        No news available.
                    </motion.p>
                ) : (
                    <>
                        <NewsCardForHome news={news.slice(0, 3)} />
                        {news.length > 3 && (
                            <div className="text-end mt-3">
                                <button 
                                    className="btn btn-link" 
                                    onClick={handleSeeMore}
                                >
                                    See More
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default EducationForHome