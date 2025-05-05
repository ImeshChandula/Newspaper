import React, { useState, useEffect } from "react";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    if (window.scrollY > 200) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisible);
    return () => window.removeEventListener("scroll", toggleVisible);
  }, []);

  return (
    <button
      className={`btn btn-dark border border-secondary rounded-circle shadow-lg position-fixed bottom-0 end-0 m-4 ${
        visible ? "d-block" : "d-none"
      }`}
      style={{ width: "50px", height: "50px", zIndex: 9999 }}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <i className="bi bi-arrow-up fs-5"></i>
    </button>
  );
};

export default ScrollToTopButton;
