import React from "react";
import NewsSection from "../pages/NewsSection";
import PoliticsforHome from "../components/PoliticsFroHome";
import ForeignForHome from "../components/ForeignForHome";
import BreakingNews from "../components/BreakingNews";
import "../components/css/Home.css";
import EducationForHome from "../components/EducationForHome";
import AdSection from "../components/AdSection";

const Home = () => {
  return (
    <div className="home-page bg-white text-black min-vh-100 py-4">
      <div className="container">

        <div className="row mt-2">
          <div className="col-12">
            <AdSection />
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <BreakingNews />
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <NewsSection />
          </div>
        </div>

        <div className="container row py-2 mt-4">
          <div className="col-md-4 mb-4">
            <PoliticsforHome />
          </div>

          <div className="col-md-4 mb-4">
            <EducationForHome />
          </div>

          <div className="col-md-4 mb-4">
            <ForeignForHome />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
