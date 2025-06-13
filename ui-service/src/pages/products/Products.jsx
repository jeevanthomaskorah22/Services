import React, { useState, useEffect } from 'react';
import "./products.css";
import oneplus from "./oneplus.jpeg";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Products = () => {
  const navigate = useNavigate();
  const [openFilter, setOpenFilter] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleFilter = (filterName) => {
    setOpenFilter(openFilter === filterName ? null : filterName);
  };

  const handleFilterSelect = (filterName, option) => {
    setSelectedFilters(prev => {
      if (option === "All" || prev[filterName] === option) {
        const newFilters = { ...prev };
        delete newFilters[filterName];
        return newFilters;
      }
      return { ...prev, [filterName]: option };
    });
  };

  const removeFilter = (filterName) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterName];
      return newFilters;
    });
  };

  const filters = [
    { name: "Category", options: ["All", "Electronics", "Clothing", "Home"] },
    { name: "Brand", options: ["All", "Apple", "Samsung", "OnePlus"] },
    { name: "Price", options: ["$0-100", "$100-200", "$200-500", "$500+"] },
    { name: "Color", options: ["All", "Black", "White", "Blue", "Red"] },
    { name: "Size", options: ["All", "S", "M", "L", "XL"] },
    { name: "Rating", options: ["All", "4+ Stars", "3+ Stars", "2+ Stars"] }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token missing");
        return;
      }

      try {
        const res = await axios.get("http://localhost:8000/products/", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="products-page">
      <div className="products-header">
        <div className="keywords-container">
          {Object.entries(selectedFilters).map(([filterName, option]) => (
            <span 
              key={`${filterName}-${option}`} 
              className="keyword"
              onClick={() => removeFilter(filterName)}
            >
              {option} ×
            </span>
          ))}
        </div>
      </div>

      <div className="products-content">
        <div className="filters-sidebar">
          {filters.map((filter) => (
            <div className="filter-group" key={filter.name}>
              <div 
                className="filter-header"
                onClick={() => toggleFilter(filter.name)}
              >
                <span className="filter-label">{filter.name}</span>
                <span className="filter-arrow">
                  {openFilter === filter.name ? '−' : '+'}
                </span>
              </div>
              {openFilter === filter.name && (
                <div className="filter-options">
                  {filter.options.map((option) => (
                    <div key={option} className="filter-option">
                      <input 
                        type="radio" 
                        id={`${filter.name}-${option}`}
                        name={filter.name}
                        className="filter-radio"
                        checked={selectedFilters[filter.name] === option}
                        onChange={() => handleFilterSelect(filter.name, option)}
                      />
                      <label htmlFor={`${filter.name}-${option}`}>
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="products-grid">
          {loading ? (
            <p>Loading...</p>
          ) : products.length === 0 ? (
            <p>No products found</p>
          ) : (
            products.map((product) => (
              <div 
                className="product-card" 
                key={product.id} 
                onClick={() => {navigate("/product-detail/"+product.id)}}
              >
                <img src={oneplus} alt="Product" className="product-image" />
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">${product.price}</p>
                  <p className="product-stock">Stock: {product.stock}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
