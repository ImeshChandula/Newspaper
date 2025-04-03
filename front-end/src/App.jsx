import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "../node_modules/bootstrap/dist/js/bootstrap.js";
import newsData from "./data/data.js";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/Home.jsx";
import SportPage from "./pages/Sport.jsx";
import EducationPage from "./pages/Education.jsx";
import PoliticsPage from "./pages/Politics.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import Footer from "./components/Footer.jsx";

const App = () => {
  const [latestNews, setLatestNews] = useState([]);

  useEffect(() => {
    const now = new Date().getTime();
    const TEN_MINUTES = 10 * 60 * 1000;
    const recentNews = newsData.filter(news => now - news.timestamp <= TEN_MINUTES);
    setLatestNews(recentNews);
  }, []);

  return (
    <Router>
      <div className="bg-light">
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<HomePage latestNews={latestNews} />} />
            <Route path="/sport" element={<SportPage />} />
            <Route path="/education" element={<EducationPage />} />
            <Route path="/politics" element={<PoliticsPage />} />
            <Route path="/search" element={<SearchResults />} />
          </Routes>
        </div>
      </div>
      <Footer/>
    </Router>
  );
};

export default App;
