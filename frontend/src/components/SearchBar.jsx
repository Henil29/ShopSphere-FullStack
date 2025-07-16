import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductData } from '../context/product.contex.jsx';
import './SearchBar.css';

const SearchBar = () => {
  const { products } = ProductData();
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef();

  const suggestions =
    query.length > 0
      ? products.filter(p =>
          p.name.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 7)
      : [];

  const handleSelect = (product) => {
    setQuery('');
    setShowSuggestions(false);
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="amazon-searchbar-container">
      <input
        ref={inputRef}
        className="amazon-searchbar-input"
        type="text"
        placeholder="Search for products..."
        value={query}
        onChange={e => {
          setQuery(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="amazon-searchbar-suggestions">
          {suggestions.map(product => (
            <div
              key={product._id}
              className="amazon-searchbar-suggestion"
              onMouseDown={() => handleSelect(product)}
            >
              <img src={product.image?.url} alt={product.name} className="amazon-searchbar-suggestion-img" />
              <span>{product.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar; 