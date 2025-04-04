import React from "react";
import { useLocation } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import newsData from "../data/data";
import NewsCard from "../components/NewsCardForSearch";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchResults = () => {
  const query = useQuery().get("query");
  const lowerCaseQuery = query.toLowerCase();
  const navigate = useNavigate();

  // Find news articles that have tags containing the search term
  const filteredNews = newsData.filter((news) =>
    news.tags.some((tag) => tag.toLowerCase().includes(lowerCaseQuery))
  );

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center mb-3">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-outline-secondary me-3"
        >
          &larr;
        </button>
        <h2 className="mb-0">Search Results for "{query}"</h2>
      </div>


      {filteredNews.length > 0 ? (
        <div className="row">
          {filteredNews.map((news, index) => (
            <div key={index} className="col-md-6 col-lg-4">
              <NewsCard news={news} showDetails={true} />
            </div>
          ))}
        </div>
      ) : (
        <p>No news found matching your search.</p>
      )}
    </div>
  );
};

export default SearchResults;
