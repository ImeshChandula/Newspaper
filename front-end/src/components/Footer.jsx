import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./css/Footer.css";

const Footer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
  };

  return (
    <footer className="footer bg-light py-4 mt-5">
      <div className="container">
        <div className="row">
          {/* Logo & Description */}
          <div className="col-md-4">
            <h5 className="text-uppercase">NewsHub</h5>
            <p>Stay updated with the latest news, trends, and insights from around the world.</p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4">
            <h5 className="text-uppercase">Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/sport" className="footer-link">Sport</Link></li>
              <li><Link to="/education" className="footer-link">Education</Link></li>
              <li><Link to="/politics" className="footer-link">Politics</Link></li>
              <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="col-md-4">
            <h5 className="text-uppercase">Follow Us</h5>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright & Live Clock (Flexbox for Alignment) */}
        <div className="footer-bottom d-flex flex-column flex-md-row justify-content-between align-items-center mt-3">
          <p className="mb-0">&copy; {new Date().getFullYear()} NewsHub. All Rights Reserved.</p>
          <p className="live-time mb-0">Current Time: {formatTime(currentTime)}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
