import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfileDropdown from "./ProfileDropDown";
import ProfilForSD from "./ProfileForSD";
import "./css/Navbar.css";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm fixed-top custom-navbar">
      <div className="container-fluid px-4">
        <Link className="navbar-brand fw-bold me-4" to="/">Logo</Link>

        <p className="live-time d-lg-none text-end fw-bold mb-0">{formatTime(currentTime)}</p>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse mt-3 mt-lg-0" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-2">

            <div className="nav-item d-lg-none w-100 mb-3">
              <ProfilForSD />
            </div>

            <li className="nav-item"><Link className="nav-link px-3" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link px-3" to="/sport">Sport</Link></li>
            <li className="nav-item"><Link className="nav-link px-3" to="/education">Education</Link></li>
            <li className="nav-item"><Link className="nav-link px-3" to="/politics">Politics</Link></li>

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
          
          <p className="live-time text-end fw-bold mb-0">{formatTime(currentTime)}</p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
