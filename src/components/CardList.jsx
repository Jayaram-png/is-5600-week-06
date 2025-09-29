import React, { useState, useEffect } from "react";
import Card from "./Card";
import Button from "./Button";
import Search from "./Search";

const CardList = ({ data }) => {
  const limit = 10;

  const [offset, setOffset] = useState(0);
  const [filteredData, setFilteredData] = useState(data);
  const [products, setProducts] = useState([]);

  // Initialize products and filteredData when data prop changes
  useEffect(() => {
    setFilteredData(data);
    setProducts(data.slice(0, limit));
    setOffset(0); // reset pagination when data changes
  }, [data]);

  // Update products when offset or filteredData changes
  useEffect(() => {
    const start = offset;
    const end = offset + limit;
    setProducts(filteredData.slice(start, end));
  }, [filteredData, offset]);

  // Search handler
  const filterTags = (searchTerm) => {
    const lower = searchTerm.trim().toLowerCase();
    if (lower === "") {
      // Reset to all data if empty search
      setFilteredData(data);
    } else {
      const filtered = data.filter((product) =>
        product.tags.some((tag) => tag.toLowerCase().includes(lower))
      );
      setFilteredData(filtered);
    }
    setOffset(0); // reset pagination
  };

  const handlePageChange = (direction) => {
    if (direction === "next" && offset + limit < filteredData.length) {
      setOffset(offset + limit);
    }
    if (direction === "prev" && offset - limit >= 0) {
      setOffset(offset - limit);
    }
  };

  return (
    <div className="cf pa2">
      {/* Search */}
      <div className="mt2 mb2">
        <Search handleSearch={filterTags} />
      </div>

      {/* Product list */}
      <div className="mt2 mb2">
        {products.length > 0 ? (
          products.map((product) => <Card key={product.id} {...product} />)
        ) : (
          <p>No products found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center pa4">
        <Button
          text="Previous"
          handleClick={() => handlePageChange("prev")}
          disabled={offset === 0}
        />
        <Button
          text="Next"
          handleClick={() => handlePageChange("next")}
          disabled={offset + limit >= filteredData.length}
        />
      </div>
    </div>
  );
};

export default CardList;