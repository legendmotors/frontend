import React, { useState } from "react";
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
            // Replace this URL with your actual API endpoint
            const response = await fetch(`/api/search?q=${query}`);
            const data = await response.json();
            setResults(data.results || []); // Assuming the API returns a `results` array
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
                        <i className="icon-autodeal-search position-absolute top-50 start-100 translate-middle pe-5" />
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
                        results.map((item, index) => (
                            <a
                                href={item.url}
                                key={index}
                                className="dropdown-item"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {item.title}
                            </a>
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
