import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "../node_modules/bootstrap/dist/js/bootstrap.js";
import newsData from "./data/data.js";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/Home.jsx";
import SportPage from "./pages/Sport.jsx";
import EducationPage from "./pages/Education.jsx";
import PoliticsPage from "./pages/Politics.jsx";
import Signin from "./pages/signin.jsx";
import Signup from "./pages/signup.jsx"; 

const App = () => {
  const [latestNews, setLatestNews] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  useEffect(() => {
    const now = new Date().getTime();
    const TEN_MINUTES = 10 * 60 * 1000;
    const recentNews = newsData.filter(news => now - news.timestamp <= TEN_MINUTES);
    setLatestNews(recentNews);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      {isAuthenticated ? (
        <div className="bg-light">
          <Navbar />
          <div className="container mt-4">
            <Routes>
              <Route path="/" element={<HomePage latestNews={latestNews} />} />
              <Route path="/sport" element={<SportPage />} />
              <Route path="/education" element={<EducationPage />} />
              <Route path="/politics" element={<PoliticsPage />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/signin" element={<Signin onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;
