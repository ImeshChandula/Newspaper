import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";
import "./css/Footer.css";

const Footer = () => {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const iconHover = {
    whileHover: { scale: 1.15, rotate: 3 },
    whileTap: { scale: 0.95 },
  };

  return (
    <motion.footer
      className="footer bg-light py-4 mt-5"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUpVariants}
    >
      <div className="container">
        <div className="row">
          <motion.div className="col-md-4" variants={itemVariants}>
            <h5 className="text-uppercase">NewsPaper</h5>
            <p>
              Stay updated with the latest news, trends, and insights from
              around the world.
            </p>
          </motion.div>

          <motion.div className="col-md-4" variants={itemVariants}>
            <h5 className="text-uppercase">Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/sport" className="footer-link">Sport</Link></li>
              <li><Link to="/education" className="footer-link">Education</Link></li>
              <li><Link to="/politics" className="footer-link">Politics</Link></li>
              <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
            </ul>
          </motion.div>

          <motion.div className="col-md-4" variants={itemVariants}>
            <h5 className="text-uppercase">Follow Us</h5>
            <div className="social-icons d-flex gap-3 mt-2">
              {[
                { icon: <FaFacebookF />, url: "https://facebook.com" },
                { icon: <FaTwitter />, url: "https://twitter.com" },
                { icon: <FaInstagram />, url: "https://instagram.com" },
                { icon: <FaLinkedin />, url: "https://linkedin.com" },
              ].map(({ icon, url }, idx) => (
                <motion.a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none text-muted fs-5"
                  {...iconHover}
                >
                  {icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="footer-bottom d-flex flex-column flex-md-row justify-content-between align-items-center mt-3"
          variants={itemVariants}
        >
          <p className="mb-0">
            &copy; {new Date().getFullYear()} NewsPaper. All Rights Reserved.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
