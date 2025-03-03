"use client";

import CarService from "@/services/CarService";
import React, { useState } from "react";
import Swal from "sweetalert2";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchTerm(query);

    if (query.trim() === "") {
      setResults([]);
      return;
    }

    setIsLoading(true);

    try {
      // Call fuzzy search using CarService.fuzzySearch
      const response = await CarService.fuzzySearch({ search: query, page: 1, limit: 10 });
      console.log("Fuzzy search response:", response); // Debug: Inspect the API response
      
      if (response && response.success && response.data && response.data.length > 0) {
        setResults(response.data);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="position-relative search-mobile">
      <div className="wd-find-select">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group-1 search-form form-style2 relative">
            <i className="fal fa-search position-absolute top-50 start-100 translate-middle pe-5"/>
            <input
              type="search"
              className="search-field"
              id="search-terms"
              placeholder="Search by Make, Model, or Keyword"
              value={searchTerm}
              onChange={handleSearch}
              name="s"
              title="Search for"
              required
            />
          </div>
        </form>
      </div>
      {searchTerm && (
        <div
          className="dropdown-menu show w-100"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            zIndex: 1050,
            maxHeight: "300px",
            overflowY: "auto",
            border: "1px solid #ccc",
          }}
        >
          {isLoading ? (
            <p className="dropdown-item text-muted">Loading...</p>
          ) : results.length > 0 ? (
            results.map((car) => (
              <div key={car.id} className="dropdown-item">
                <a href={`#car-${car.id}`} onClick={(e) => e.preventDefault()}>
                  <h6>
                    {car.Brand?.name} {car.CarModel?.name}
                  </h6>
                  <p>
                    {car.stockId} - {car.description}
                  </p>
                  <p>
                    {car.Year?.year} {car.Trim?.name ? `| ${car.Trim.name}` : ""}
                  </p>
                </a>
              </div>
            ))
          ) : (
            <p className="dropdown-item text-muted">No results found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
