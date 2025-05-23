import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaArrowRight,
  FaHome,
  FaBook,
  FaGraduationCap,
  FaGavel,
  FaRegNewspaper
} from "react-icons/fa";
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

  return (
    <motion.footer
      className="footer-section footer bg-black text-white py-5 mt-5 border-top border-secondary"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUpVariants}
    >
      <div className="container">

        {/* Header Row */}
        <motion.div className="row mb-4 align-items-center" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="col-12 col-md-6 text-center text-md-start mb-3 mb-md-0">
            <h3 className="text-uppercase fw-bold mb-0"><FaRegNewspaper className="fs-1" /> Sivdesa News</h3>
          </div>

          <div className="col-12 col-md-6">
            <div className="d-flex flex-column flex-sm-row align-items-center justify-content-sm-start justify-content-md-end gap-2 gap-sm-3">
              <h6 className="mb-0 text-center text-sm-start flex-shrink-0">
                Subscribe to Newsletter
              </h6>
              <form className="d-flex flex-column flex-sm-row align-items-stretch w-100" style={{ maxWidth: "100%" }}>
                <input
                  type="email"
                  className="form-control bg-dark text-light border border-secondary me-0 me-sm-2 mb-2 mb-sm-0"
                  placeholder="Enter your email"
                  style={{ flexGrow: 1 }}
                />
                <button type="submit" className="btn btn-outline-light w-50 w-sm-auto">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Main Footer Row */}
        <div className="row">
          {/* About */}
          <motion.div className="col-lg-3 col-md-6" variants={itemVariants}>
            <h5 className="text-uppercase fw-bold mb-3">About us</h5>
            <p className="text-white-50">Stay informed with quality news updates, global headlines, and trusted journalism every day.</p>
            <Link to="#" className="text-white-50 text-decoration-none d-inline-flex align-items-center about-button">
              <FaArrowRight className="me-2" /> Learn more
            </Link>
          </motion.div>

          {/* Quick Links */}
          <motion.div className="col-md-3 mb-4" variants={itemVariants}>
            <h5 className="text-uppercase fw-bold mt-4 mt-md-0">Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="footer-link text-white-50 text-decoration-none d-flex align-items-center"><FaHome className="me-2" /> Home</Link></li>
              <li><Link to="/sports" className="footer-link text-white-50 text-decoration-none d-flex align-items-center"><FaBook className="me-2" /> Sport</Link></li>
              <li><Link to="/education" className="footer-link text-white-50 text-decoration-none d-flex align-items-center"><FaGraduationCap className="me-2" /> Education</Link></li>
              <li><Link to="/politics" className="footer-link text-white-50 text-decoration-none d-flex align-items-center"><FaGavel className="me-2" /> Politics</Link></li>
            </ul>
          </motion.div>

          {/* Contact Us */}
          <motion.div className="col-md-3 mb-4" variants={itemVariants}>
            <h5 className="text-uppercase fw-bold">Contact Us</h5>
            <p className="text-white-50 mb-1 d-flex align-items-center">
              <FaEnvelope className="me-2" /> <a href="mailto:info@sivdesanews.lk" className="text-white-50 contact-links text-decoration-none">info@sivdesanews.lk</a>
            </p>
            <p className="text-white-50 mb-1 d-flex align-items-center">
              <FaPhone className="me-2" /> <a href="tel:+94717070068" className="text-white-50 contact-links text-decoration-none">071 707 0068</a>
            </p>
            <p className="text-white-50 mb-1 d-flex align-items-center">
              <FaMapMarkerAlt className="me-2" /> Kandy, Sri Lanka
            </p>
          </motion.div>

          {/* Social Media */}
          <motion.div className="col-md-3 mb-4" variants={itemVariants}>
            <h5 className="text-uppercase fw-bold">Follow Us</h5>
            <div className="d-flex gap-3 mt-2">
              <motion.a
                href="https://www.facebook.com/share/1C8bXjC9kx/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon text-white-50 border-white-50 border fs-5 d-flex align-items-center justify-content-center rounded-circle"
                style={{ width: "40px", height: "40px" }}
                aria-label="Facebook"
              >
                <FaFacebookF />
              </motion.a>
              <motion.a
                href="https://www.youtube.com/@Sivdesanews"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon text-white-50 border-white-50 border fs-5 d-flex align-items-center justify-content-center rounded-circle"
                style={{ width: "40px", height: "40px" }}
                aria-label="YouTube"
              >
                <FaYoutube />
              </motion.a>
            </div>
            <p className="text-white-50 mt-2">Connect with us on social platforms for real-time updates.</p>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div className="footer-bottom border-top border-secondary pt-4 mt-4 d-flex flex-column flex-md-row justify-content-between align-items-center text-muted" variants={itemVariants}>
          <p className="mb-2 mb-md-0 text-white-50">&copy; {new Date().getFullYear()} Sivdesa News. All rights reserved.</p>
          <div className="d-flex gap-3">
            <Link to="#" className="text-white-50 text-decoration-none d-flex align-items-center">Privacy Policy</Link>
            <Link to="#" className="text-white-50 text-decoration-none d-flex align-items-center">Terms of Use</Link>
            <Link to="#" className="text-white-50 text-decoration-none d-flex align-items-center">Cookie Policy</Link>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
