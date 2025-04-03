import React from "react";
import NewsSection from "./NewsSection.jsx";
import newsData from "../data/data.js";

const SportPage = () => {
  const sportNews = newsData
    .filter((n) => n.tags.includes("Sport"))
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div>
      <NewsSection title="Sport News" news={sportNews} />
    </div>
  );
};

export default SportPage;
