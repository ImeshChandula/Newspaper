import React from "react";
import NewsSection from "./NewsSection.jsx";
import newsData from "../data/data.js";

const EducationPage = () => {
  const educationNews = newsData
    .filter((n) => n.tags.includes("Education"))
    .sort((a, b) => b.timestamp - a.timestamp);
  return (
    <div>
      <NewsSection title="Education News" news={educationNews} />
    </div>
  );
};

export default EducationPage;
