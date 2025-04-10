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
        duration: 0.4,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
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

          {/* Column 1: About */}
          <motion.div className="col-md-4" variants={fadeUpVariants}>
            <motion.h5 className="text-uppercase" variants={itemVariants}>
              NewsPaper
            </motion.h5>
            <motion.p variants={itemVariants}>
              Stay updated with the latest news, trends, and insights from around the world.
            </motion.p>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div className="col-md-4" variants={fadeUpVariants}>
            <motion.h5 className="text-uppercase" variants={itemVariants}>
              Quick Links
            </motion.h5>
            <motion.ul className="list-unstyled" variants={fadeUpVariants}>
              {[
                { to: "/", label: "Home" },
                { to: "/sport", label: "Sport" },
                { to: "/education", label: "Education" },
                { to: "/politics", label: "Politics" },
                { to: "/contact", label: "Contact Us" },
              ].map((link, i) => (
                <motion.li key={i} variants={itemVariants}>
                  <Link to={link.to} className="footer-link">
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Column 3: Social Media */}
          <motion.div className="col-md-4" variants={fadeUpVariants}>
            <motion.h5 className="text-uppercase" variants={itemVariants}>
              Follow Us
            </motion.h5>
            <motion.div
              className="social-icons d-flex gap-3 mt-2"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.3,
                  },
                },
              }}
            >
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
                  variants={itemVariants}
                  whileHover={{ scale: 1.15, rotate: 3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {icon}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <motion.div
          className="footer-bottom d-flex flex-column flex-md-row justify-content-between align-items-center mt-3"
          variants={fadeUpVariants}
        >
          <motion.p className="mb-0" variants={itemVariants}>
            &copy; {new Date().getFullYear()} NewsPaper. All Rights Reserved.
          </motion.p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
