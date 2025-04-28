import React, { useEffect, useState } from "react";
import axios from "axios";
import NewsCardForHome from "./NewsCardForHome";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const PoliticsForHome = () => {
  const { t } = useTranslation();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL_NEWS}/politics/accept`
        );
        setNews(data);
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
        className="border-bottom pb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {t("politicsSection")}
      </motion.h2>

      <div className="container">
        {loading ? (
          <motion.div
            className="text-center py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">
                {t("loading")}
              </span>
            </div>
          </motion.div>
        ) : news.length === 0 ? (
          <motion.p
            className="text-center py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {t("noNews")}
          </motion.p>
        ) : (
          <NewsCardForHome news={news} />
        )}
      </div>
    </div>
  );
};

export default PoliticsForHome;
