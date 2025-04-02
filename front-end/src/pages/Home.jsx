import React from "react";
import NewsSection from "./NewsSection.jsx";
import newsData from "../data/data.js";

const HomePage = ({ latestNews }) => {
  const sortedNews = [...newsData].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div>
      {latestNews.length > 0 && (
        <div className="container mt-4">
          <NewsSection title="Recently Published" news={latestNews} highlight={true} />
        </div>
      )}

      <div className="container mt-4">
        <div className="row">
          <div className="col-md-4">
            <NewsSection title="Politics" news={sortedNews.filter(n => n.tags.includes("Politics"))} />
          </div>
          <div className="col-md-4">
            <NewsSection title="Top Stories" news={sortedNews.slice(0, 3)} />
          </div>
          <div className="col-md-4">
            <NewsSection title="Latest News" news={sortedNews.slice(2, 5)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
