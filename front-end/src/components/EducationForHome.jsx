import React, { useEffect, useState } from "react";
import axios from "axios";
import NewsCardForHome from "./NewsCardForHome";
import { motion } from "framer-motion";

const EducationForHome = () => {

    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

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
                    <NewsCardForHome news={news} />
                )}
            </div>
        </div>
  )
}

export default EducationForHome