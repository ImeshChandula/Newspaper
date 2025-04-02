import React from "react";
import NewsCard from "../components/NewsCard.jsx";

const NewsSection = ({ title, news, highlight }) => {
  return (
    <div className="container my-4">
      <h2 className="border-bottom pb-2">{title}</h2>
      <div className="row g-4">
        {news.map((item, index) => (
          <div key={index} className={`${highlight && "highlight-card"}`}>
            <NewsCard {...item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsSection;
