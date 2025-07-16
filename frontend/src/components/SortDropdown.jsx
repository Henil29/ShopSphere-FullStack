import React from 'react';
import { ProductData } from '../context/product.contex.jsx';
import './SortDropdown.css';

const SortDropdown = () => {
  const { filteredProducts, setFilteredProducts } = ProductData();

  const handleSort = (e) => {
    const value = e.target.value;
    let sorted = [...filteredProducts];
    if (value === 'priceLowHigh') {
      sorted.sort((a, b) => Number(a.newprice) - Number(b.newprice));
    } else if (value === 'priceHighLow') {
      sorted.sort((a, b) => Number(b.newprice) - Number(a.newprice));
    } else if (value === 'rating') {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (value === 'latest') {
      sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
    setFilteredProducts(sorted);
  };

  return (
    <div className="amazon-sort-dropdown-container">
      <label htmlFor="sort" className="amazon-sort-dropdown-label">Sort by:</label>
      <select id="sort" className="amazon-sort-dropdown" onChange={handleSort} defaultValue="latest">
        <option value="latest">Latest</option>
        <option value="priceLowHigh">Price: Low to High</option>
        <option value="priceHighLow">Price: High to Low</option>
        <option value="rating">Rating</option>
      </select>
    </div>
  );
};

export default SortDropdown; 