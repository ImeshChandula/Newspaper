import React from "react";
import NewsSection from "../pages/NewsSection";
import PoliticsforHome from "../components/PoliticsFroHome";
import ForeignForHome from "../components/ForeignForHome";
import BreakingNews from "../components/BreakingNews";
import "../components/css/Home.css";
import EducationForHome from "../components/EducationForHome";
import AdSection from "../components/AdSection";
import OtherForHome from "../components/OtherForHome";

const Home = () => {
  return (
    <div className="home-page bg-white text-black min-vh-100 py-4">
      <div className="container">

        {/* Advertisement */}
        <div className="row mt-2">
          <div className="col-12">
            <AdSection />
          </div>
        </div>

        {/* Breaking News */}
        <div className="row">
          <div className="col-12">
            <BreakingNews />
          </div>
        </div>

        {/* Main News Section */}
        <div className="row">
          <div className="col-12">
            <NewsSection />
          </div>
        </div>

        {/* Category Sections */}
        <div className="row py-2 mt-4">
          <div className="col-12 col-sm-6 col-lg-3 mb-4">
            <PoliticsforHome />
          </div>

          <div className="col-12 col-sm-6 col-lg-3 mb-4">
            <EducationForHome />
          </div>

          <div className="col-12 col-sm-6 col-lg-3 mb-4">
            <ForeignForHome />
          </div>

          <div className="col-12 col-sm-6 col-lg-3 mb-4">
            <OtherForHome />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
