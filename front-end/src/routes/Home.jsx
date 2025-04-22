import React from "react";
import NewsSection from "../pages/NewsSection";
import PoliticsforHome from "../components/PoliticsFroHome";
import SportForHome from "../components/SportForHome";
import BreakingNews from "../components/BreakingNews";
import "../components/css/Home.css";
import EducationForHome from "../components/EducationForHome";

const Home = () => {
  return (
    <div className="home-page">
      <div className="container mt-4">
        <div className="row mb-5">
          <div className="col-12">
            <BreakingNews />
          </div>
        </div>

        <div className="row mb-2">
          <div className="col-12">
            <NewsSection />
          </div>
        </div>

        <div className="row py-2">

          <div className="col-md-4">
            <PoliticsforHome />
          </div>

          <div className="col-md-4">
            <EducationForHome />
          </div>

          <div className="col-md-4">
            <SportForHome />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
