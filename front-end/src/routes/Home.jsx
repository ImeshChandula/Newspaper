import React from "react";
import NewsSection from "../pages/NewsSection";
import PoliticsforHome from "../components/PoliticsFroHome";
import SportForHome from "../components/SportForHome";
import "../components/css/Home.css"
import EducationForHome from "../components/EducationForHome";
const Home = () => {
  
  return (
    <div className="home-page">
      <div className="container row mt-4">
        <NewsSection/>
      </div>
      <div className="row py-4">
        <div className="col-md-4">
          <PoliticsforHome/>
        </div>
        <div className="col-md-4">
          <EducationForHome />
        </div>
        <div className="col-md-4">
          <SportForHome/>
        </div>
      </div>
    </div>
  );
};

export default Home;
