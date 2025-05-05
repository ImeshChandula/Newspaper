import React from "react";
import NewsSection from "../pages/NewsSection";
import PoliticsforHome from "../components/PoliticsFroHome";
import SportForHome from "../components/SportForHome";
import BreakingNews from "../components/BreakingNews";
import "../components/css/Home.css";
import EducationForHome from "../components/EducationForHome";
import AdCarousel from "../components/adCarousel";

const Home = () => {
  return (
    <div className="home-page bg-white text-black min-vh-100 py-4">
      <div className="container">

        <div className="row">
          <div className="col-12">
            <AdCarousel />
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <BreakingNews />
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-12">
            <NewsSection />
          </div>
        </div>

        <div className="row py-2 mt-4">
          <div className="col-md-4 mb-4">
            <PoliticsforHome />
          </div>

          <div className="col-md-4 mb-4">
            <EducationForHome />
          </div>

          <div className="col-md-4 mb-4">
            <SportForHome />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
