import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin, } from "react-icons/fa";
import "./css/Footer.css";

const Footer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());

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

  return (
    <footer className="footer bg-light py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5 className="text-uppercase">NewsHub</h5>
            <p>
              Stay updated with the latest news, trends, and insights from
              around the world.
            </p>
          </div>

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

          <div className="col-md-4">
            <h5 className="text-uppercase">Follow Us</h5>
            <div className="social-icons d-flex gap-3 mt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-muted fs-5">
                <FaFacebookF />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-muted fs-5">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-muted fs-5">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-muted fs-5">
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom d-flex flex-column flex-md-row justify-content-between align-items-center mt-3">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} NewsHub. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
