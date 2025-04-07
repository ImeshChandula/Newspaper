import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // User profile icon

const Navbar = ({ isLoggedIn, username, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  const navigate = useNavigate();

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(""); // Clear input after search
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username");
      onLogout(); // Call the onLogout function passed as a prop
      navigate("/signin"); // Redirect to Signin page
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm fixed-top">
      <div className="container">
        <Link className="navbar-brand" to="/">Logo</Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/sport">Sport</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/education">Education</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/politics">Politics</Link></li>
          </ul>
        </div>

        {/* Time & Date above search bar */}
        <div className="text-center">
          <span className="fw-bold text-black d-block"
            style={{ fontSize: "1.5rem", fontFamily: "Arial, sans-serif", letterSpacing: "1px", textShadow: "1px 1px 3px rgba(0, 0, 0, 0.2)" }}>
            {currentTime.toLocaleTimeString()} | {currentTime.toLocaleDateString()}
          </span>
          <form className="d-flex mt-2" onSubmit={handleSearch}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search by tag"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ fontSize: "1rem" }}
            />
            <button className="btn btn-outline-primary" type="submit" style={{ fontSize: "1rem" }}>
              Search
            </button>
          </form>
        </div>

        {/* SignIn/SignUp or User Profile Dropdown */}
        <div className="ms-auto">
          {!isLoggedIn ? (
            <div className="d-flex">
              <Link to="/login" className="btn btn-outline-primary me-2">Sign In</Link>
              <Link to="/signup" className="btn btn-outline-secondary">Sign Up</Link>
            </div>
          ) : (
            <div className="d-flex align-items-center">
              <span className="me-2">Hello, {username}</span>
              <FaUserCircle size={30} className="me-2" />
              <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
