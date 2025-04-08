import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const NewsDetail = () => {
    const { id } = useParams();
    const [newsItem, setNewsItem] = useState(null);

    useEffect(() => {
        const fetchNewsItem = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/news/getNewsArticleByID/${id}`);
                setNewsItem(response.data);
            } catch (error) {
                console.error("Error fetching news item:", error);
            }
        };

        fetchNewsItem();
    }, [id]);

    if (!newsItem) {
        return <div>News not found</div>;
    }

    return (
        <div className="container mt-4">
            <h1>{newsItem.title}</h1>
            {newsItem.media && <img src={newsItem.media} alt={newsItem.title} className="img-fluid" />}
            <p>{newsItem.content}</p>
            <div className="d-flex justify-content-between small text-muted">
                <span>By {newsItem?.author?.username ?? "Unknown"}</span>
                <span>{new Date(newsItem.date).toLocaleString()}</span>
            </div>
        </div>
    );
};

export default NewsDetail;
