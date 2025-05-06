import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
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
      className="footer bg-black text-white py-5 mt-5 border-top border-secondary"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUpVariants}
    >
      <div className="container">
        <div className="row">
          {/* About */}
          <motion.div className="col-md-3 mb-4" variants={itemVariants}>
            <h5 className="text-uppercase text-white">NewsPaper</h5>
            <p>
              Stay updated with the latest news, trends, and insights from
              around the world.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div className="col-md-3 mb-4" variants={itemVariants}>
            <h5 className="text-uppercase text-white">Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="footer-link text-white">Home</Link></li>
              <li><Link to="/sport" className="footer-link text-white">Sport</Link></li>
              <li><Link to="/education" className="footer-link text-white">Education</Link></li>
              <li><Link to="/politics" className="footer-link text-white">Politics</Link></li>
            </ul>
          </motion.div>

          {/* Contact Us */}
          <motion.div className="col-md-3 mb-4" variants={itemVariants}>
            <h5 className="text-uppercase text-white">Contact Us</h5>
            <p>
              Email:{" "}
              <a
                href="mailto:info@sivdesanews.lk"
                className="text-white text-decoration-underline"
              >
                info@sivdesanews.lk
              </a>
            </p>
          </motion.div>

          {/* Social Media */}
          <motion.div className="col-md-3 mb-4" variants={itemVariants}>
            <h5 className="text-uppercase text-white">Follow Us</h5>
            <div className="d-flex gap-3 mt-2">
              {[
                { icon: <FaFacebookF />, url: "https://www.facebook.com/share/1C8bXjC9kx/?mibextid=wwXIfr", label: "Facebook" },
                { icon: <FaYoutube />, url: "https://www.youtube.com/@Sivdesanews", label: "YouTube" },
              ].map(({ icon, url, label }, idx) => (
                <motion.a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white fs-5"
                  aria-label={label}
                  {...iconHover}
                >
                  {icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <motion.div
          className="footer-bottom text-center pt-3 border-top border-secondary mt-4"
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
