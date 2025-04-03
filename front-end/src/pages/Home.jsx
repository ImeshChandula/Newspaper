import React from "react";
import NewsSection from "./NewsSection.jsx";
import NewsSectionForHome from "./NewsSectionForHome.jsx";
import newsData from "../data/data.js";

const HomePage = ({ latestNews }) => {
  const sortedNews = [...newsData].sort((a, b) => b.timestamp - a.timestamp);
  const sortedLatestNews = [...latestNews].sort((a, b) => b.timestamp - a.timestamp); // Sort latestNews

  return (
    <div>
      {sortedLatestNews.length > 0 && (
        <div className="container mt-4">
          <NewsSection title="Recently Published" news={sortedLatestNews} highlight={true} />  {/* Use sortedLatestNews */}
        </div>
      )}

      <div className="container mt-4">
        <div className="row">
          <div className="col-md-4">
            <NewsSectionForHome title="Politics" news={sortedNews.filter(n => n.tags.includes("Politics"))} />
          </div>
          <div className="col-md-4">
            <NewsSectionForHome title="Education" news={sortedNews.filter(n => n.tags.includes("Education"))} />
          </div>
          <div className="col-md-4">
            <NewsSectionForHome title="Top Stories" news={sortedNews.slice(0, 3)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
