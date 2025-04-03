import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Import user profile icon

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track user login status
  const navigate = useNavigate();

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".profile-menu")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
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
      setIsLoggedIn(false); // Update login status
      navigate("/login"); // Redirect to login page after logout
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm fixed-top">
      <div className="container">
        <a className="navbar-brand" href="#">Logo</a>
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
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/sport">Sport</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/education">Education</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/politics">Politics</Link>
            </li>
          </ul>
        </div>

        {/* Time & Date above search bar */}
        <div className="text-center">
          <span 
            className="fw-bold text-black d-block"
            style={{ 
              fontSize: "1.5rem",  
              fontFamily: "Arial, sans-serif",
              letterSpacing: "1px",
              textShadow: "1px 1px 3px rgba(0, 0, 0, 0.2)"
            }}
          >
            {currentTime.toLocaleTimeString()} | {currentTime.toLocaleDateString()}
          </span>
          <form className="d-flex mt-2" onSubmit={handleSearch}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search by tag"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ fontSize: "1rem" }} // Increased font size for clarity
            />
            <button className="btn btn-outline-primary" type="submit" style={{ fontSize: "1rem" }}>
              Search
            </button>
          </form>
        </div>

        {/* Conditionally render SignIn/SignUp or User Profile Dropdown */}
        <div className="ms-3 d-flex align-items-center">
          {!isLoggedIn ? (
            <>
              <Link to="/signin" className="btn btn-outline-primary me-2">Sign In</Link>
              <Link to="/signup" className="btn btn-outline-secondary">Sign Up</Link>
            </>
          ) : (
            <div className="position-relative profile-menu" style={{ marginTop: "10px" }}>
              <FaUserCircle 
                size={35} 
                className="text-dark cursor-pointer transition-all duration-200 ease-in-out hover:text-primary"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ transition: "transform 0.2s ease-in-out" }}
              />
              {dropdownOpen && (
                <div 
                  className="dropdown-menu show position-absolute end-0 mt-2 p-2 rounded shadow"
                  style={{
                    minWidth: "180px", 
                    boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
                    top: "100%", // Ensures the dropdown appears directly below the icon
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Link className="dropdown-item" to="/profile" style={{ fontSize: "1rem" }}>
                    Profile
                  </Link>
                  <Link className="dropdown-item" to="/settings" style={{ fontSize: "1rem" }}>
                    Settings
                  </Link>
                  <Link 
                    className="dropdown-item text-danger" 
                    onClick={handleLogout}
                    to="#"
                    style={{ fontSize: "1rem" }}
                  >
                    Logout
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
