import React from "react";
import NewsSection from "./NewsSection.jsx";
import newsData from "../data/data.js";

const PoliticsPage = () => {
  const politicsNews = newsData
    .filter((n) => n.tags.includes("Politics"))
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div>
      <NewsSection title="Politics News" news={politicsNews} />
    </div>
  );
};

export default PoliticsPage;
