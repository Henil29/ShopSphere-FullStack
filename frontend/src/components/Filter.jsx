import React, { useEffect, useState } from 'react';
import { ProductData } from '../context/product.contex.jsx';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './Filter.css';

const COMMON_CATEGORIES = [
  'Electronics', 'Fashion', 'Books', 'Home', 'Beauty', 'Sports', 'Toys', 'Grocery'
];

const Filter = () => {
  const { products, setFilteredProducts } = ProductData();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [sortValue, setSortValue] = useState('latest');
  // Dual range slider state
  const prices = products.map(p => Number(p.newprice)).filter(Boolean);
  const minProductPrice = prices.length ? Math.min(...prices) : 0;
  const maxProductPrice = prices.length ? Math.max(...prices) : 10000;
  const [priceRange, setPriceRange] = useState([minProductPrice, maxProductPrice]);

  useEffect(() => {
    setPriceRange([minProductPrice, maxProductPrice]);
  }, [minProductPrice, maxProductPrice]);

  useEffect(() => {
    // Get all unique categories from products and merge with common categories
    const cats = new Set(COMMON_CATEGORIES);
    products.forEach(p => {
      if (Array.isArray(p.category)) {
        p.category.forEach(cat => cats.add(cat));
      } else if (p.category) {
        cats.add(p.category);
      }
    });
    setAllCategories(Array.from(cats));
  }, [products]);

  useEffect(() => {
    // Filter products when filters change
    let filtered = products;
    filtered = filtered.filter(p => {
      const price = Number(p.newprice);
      return price >= priceRange[0] && price <= priceRange[1];
    });
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => {
        if (Array.isArray(p.category)) {
          return p.category.some(cat => selectedCategories.includes(cat));
        } else {
          return selectedCategories.includes(p.category);
        }
      });
    }
    // Sort products
    let sorted = [...filtered];
    if (sortValue === 'priceLowHigh') {
      sorted.sort((a, b) => Number(a.newprice) - Number(b.newprice));
    } else if (sortValue === 'priceHighLow') {
      sorted.sort((a, b) => Number(b.newprice) - Number(a.newprice));
    } else if (sortValue === 'latest') {
      sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
    setFilteredProducts(sorted);
  }, [priceRange, selectedCategories, products, setFilteredProducts, sortValue]);

  const handleCategoryChange = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleSort = (e) => {
    setSortValue(e.target.value);
  };

  const handleRangeChange = (range) => {
    setPriceRange(range);
  };

  return (
    <div className="amazon-filter-container">
      <div className="amazon-filter-sortbar-row">
        <label htmlFor="sort" className="amazon-sort-dropdown-label">Sort by:</label>
        <select id="sort" className="amazon-sort-dropdown" onChange={handleSort} value={sortValue}>
          <option value="latest">Latest</option>
          <option value="priceLowHigh">Price: Low to High</option>
          <option value="priceHighLow">Price: High to Low</option>
        </select>
      </div>
      <div className="amazon-filter-section">
        <label>Price Range:</label>
        <div className="amazon-filter-range-row">
          <Slider
            range
            min={minProductPrice}
            max={maxProductPrice}
            value={priceRange}
            onChange={handleRangeChange}
            allowCross={false}
            trackStyle={[{ backgroundColor: '#ffd814', height: 6 }]}
            handleStyle={[
              { borderColor: '#ffd814', backgroundColor: '#fff', height: 22, width: 22, marginTop: -8 },
              { borderColor: '#ffd814', backgroundColor: '#fff', height: 22, width: 22, marginTop: -8 }
            ]}
            railStyle={{ backgroundColor: '#e0e0e0', height: 6 }}
          />
        </div>
        <div className="amazon-filter-range-values">
          <span>₹{priceRange[0]}</span> - <span>₹{priceRange[1]}</span>
        </div>
      </div>
      <div className="amazon-filter-section">
        <label>Category:</label>
        <div className="amazon-filter-categories">
          {allCategories.map(cat => {
            const checked = selectedCategories.includes(cat);
            return (
              <label key={cat} className="amazon-filter-category-checkbox">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleCategoryChange(cat)}
                />
                <span className={`amazon-custom-checkbox${checked ? ' amazon-custom-checkbox-checked' : ''}`}></span>
                {cat}
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Filter; 