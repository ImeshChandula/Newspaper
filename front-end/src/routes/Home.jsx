import React from "react";
import NewsSection from "../pages/NewsSection";
import PoliticsforHome from "../components/PoliticsFroHome";
import SportForHome from "../components/SportForHome";

const Home = () => {
  
  return (
    <div className="home-page">
      <div className="container row mt-4">
        <NewsSection/>
      </div>
      <div className="row">
        <div className="col-md-6">
          <PoliticsforHome/>
        </div>
        <div className="col-md-6">
          <SportForHome/>
        </div>
      </div>
    </div>
  );
};

export default Home;
