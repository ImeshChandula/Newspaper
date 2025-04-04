import React, { useState, useEffect } from "react";
import { Router, Route, Routes } from "react-router-dom";
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
import Signin from "./components/signin.jsx";
import Signup from "./components/signup.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import NewsDetails from "./components/NewsDetails.jsx";

import Home from "./routes/Home.jsx";
import Login from "./routes/Login.jsx";


const App = () => {
  const [latestNews, setLatestNews] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [username, setUsername] = useState(localStorage.getItem("username") || "");

  useEffect(() => {
    const now = new Date().getTime();
    const TEN_MINUTES = 10 * 60 * 1000;
    const recentNews = newsData.filter(news => now - news.timestamp <= TEN_MINUTES);
    setLatestNews(recentNews);
  }, []);

  const handleLogin = (status, username) => {
    setIsLoggedIn(status);
    setUsername(username);
    localStorage.setItem("isLoggedIn", status ? "true" : "false");
    localStorage.setItem("username", username);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
  };

  return (
    /*
    <Router>
      <div className="bg-light">
      <ScrollToTop />
        <Navbar isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<HomePage latestNews={latestNews} />} />
            <Route path="/sport" element={<SportPage />} />
            <Route path="/education" element={<EducationPage />} />
            <Route path="/politics" element={<PoliticsPage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/signin" element={<Signin onLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/news/:title" element={<NewsDetails />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </Router>
    */
   <>
    <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
    </Routes>
   </>
  );
};

export default App;
