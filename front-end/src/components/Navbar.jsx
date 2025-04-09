import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProfileDropdown from "./ProfileDropDown";
import ProfilForSD from "./ProfileForSD";
import "./css/Navbar.css";

const Navbar = () => {
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

  const closeNavbar = () => {
    const navbarToggler = document.getElementById("navbarNav");
    if (navbarToggler.classList.contains("show")) {
      navbarToggler.classList.remove("show");
    }
  };

  const navVariants = {
    hidden: { y: -40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12,
        duration: 0.6,
      },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delay: 0.4, duration: 0.6 },
    },
  };

  return (
    <motion.nav
      className="navbar navbar-expand-lg navbar-light bg-light shadow-sm fixed-top custom-navbar"
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container-fluid px-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link className="navbar-brand fw-bold me-4" to="/">Logo</Link>
        </motion.div>

        <div>
          <motion.p
            className="live-date d-lg-none text-end fw-light mb-0"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            {formatDate(currentDate)}
          </motion.p>
          <motion.p
            className="live-time d-lg-none text-end fw-bold mb-0"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            {formatTime(currentTime)}
          </motion.p>
        </div>

        <button className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse overflow-auto mt-3 mt-lg-0" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-2">
            <motion.div
              className="nav-item d-lg-none w-100 mb-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ProfilForSD closeNavbar={closeNavbar} />
            </motion.div>

            {["/", "/sport", "/education", "/politics"].map((path, index) => (
              <motion.li
                key={path}
                className="nav-item"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Link className="nav-link" to={path} onClick={closeNavbar}>
                  {path === "/" ? "Home" : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>

        <motion.div
          className="d-none d-lg-flex align-items-center ms-auto gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ProfileDropdown />
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <p className="live-date text-end fw-light mb-0">{formatDate(currentDate)}</p>
            <p className="live-time text-end fw-bold mb-0">{formatTime(currentTime)}</p>
          </motion.div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
