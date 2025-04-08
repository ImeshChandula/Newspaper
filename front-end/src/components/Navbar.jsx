import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfileDropdown from "./ProfileDropDown";
import ProfilForSD from "./ProfileForSD";
import "./css/Navbar.css";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const closeNavbar = () => {
    const navbarToggler = document.getElementById("navbarNav");
    if (navbarToggler.classList.contains("show")) {
      navbarToggler.classList.remove("show");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm fixed-top custom-navbar">
      <div className="container-fluid px-4">
        <Link className="navbar-brand fw-bold me-4" to="/">Logo</Link>

        <div>
          <p className="live-date d-lg-none text-end fw-light mb-0">
            {formatDate(currentDate)}
          </p>
          <p className="live-time d-lg-none text-end fw-bold mb-0">
            {formatTime(currentTime)}
          </p>
        </div>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Menu with Scrollable Property */}
        <div className="collapse navbar-collapse overflow-auto mt-3 mt-lg-0" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-2">
            <div className="nav-item d-lg-none w-100 mb-3">
              <ProfilForSD closeNavbar={closeNavbar} />
            </div>

            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={closeNavbar}>Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/sport" onClick={closeNavbar}>Sport</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/education" onClick={closeNavbar}>Education</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/politics" onClick={closeNavbar}>Politics</Link>
            </li>

            <li className="nav-item d-lg-none w-100 mt-2">
              <form className="d-flex" onSubmit={handleSearch}>
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search by tag"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn btn-outline-primary" type="submit">Search</button>
              </form>
            </li>
          </ul>
        </div>

        {/* Right Section for Larger Screens */}
        <div className="d-none d-lg-flex align-items-center ms-auto gap-3">
          <form className="d-flex me-2" onSubmit={handleSearch}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search by tag"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-outline-primary" type="submit">Search</button>
          </form>

          <ProfileDropdown />
          <div>
            <p className="live-date text-end fw-light mb-0">{formatDate(currentDate)}</p>
            <p className="live-time text-end fw-bold mb-0">{formatTime(currentTime)}</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
