import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const NewsDetail = () => {
    const { id } = useParams();
    const [newsItem, setNewsItem] = useState(null);

    useEffect(() => {
        const fetchNewsItem = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/news/getNewsArticleByID/${id}`);
                setNewsItem(response.data);
            } catch (error) {
                console.error("Error fetching news item:", error);
            }
        };

        fetchNewsItem();
    }, [id]);

    if (!newsItem) {
        return (
            <div className="container mt-5 text-center">
                <h4>News not found</h4>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-8">
                    <h1 className="mb-3 text-center">{newsItem.title}</h1>

                    {newsItem.media && (
                        <img
                            src={newsItem.media}
                            alt={newsItem.title}
                            className="img-fluid rounded mb-4 w-100"
                            style={{ maxHeight: "200px", objectFit: "contain" }}
                        />
                    )}

                    <p className="lead">{newsItem.content}</p>

                    <div className="d-flex justify-content-between flex-wrap small text-muted mt-4 border-top pt-2">
                        <span>
                            <strong>Author:</strong> {newsItem?.author?.username ?? "Unknown"}
                        </span>
                        <span>
                            <strong>Published:</strong> {new Date(newsItem.date).toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsDetail;
