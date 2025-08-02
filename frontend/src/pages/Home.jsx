import React, { useEffect, useState } from 'react';
import { ProductData } from '../context/product.contex.jsx';
import ProductCard from '../components/ProductCard.jsx';
import Filter from '../components/Filter.jsx';
import SearchBar from '../components/SearchBar.jsx';

const PRODUCTS_PER_PAGE = 12;

const Home = () => {
  const { filteredProducts, loading } = ProductData();
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setVisibleCount(PRODUCTS_PER_PAGE);
  }, [filteredProducts]);



  useEffect(() => {
    const handleScroll = () => {
      const grid = document.getElementById('amazon-product-main-grid');
      if (!grid) return;
      if (
        grid.scrollTop + grid.clientHeight >= grid.scrollHeight - 200 &&
        visibleCount < filteredProducts.length &&
        !loadingMore
      ) {
        setLoadingMore(true);
        setTimeout(() => {
          setVisibleCount(prev => Math.min(prev + PRODUCTS_PER_PAGE, filteredProducts.length));
          setLoadingMore(false);
        }, 600);
      }
    };
    const grid = document.getElementById('amazon-product-main-grid');
    if (grid) grid.addEventListener('scroll', handleScroll);
    return () => {
      if (grid) grid.removeEventListener('scroll', handleScroll);
    };
  }, [filteredProducts.length, visibleCount, loadingMore]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f7f8fa' }}>
      <div style={{ width: '20%', minWidth: 220, maxWidth: 320, height: '100vh', position: 'sticky', top: 0, background: '#fff', boxShadow: '2px 0 12px rgba(0,0,0,0.04)', zIndex: 10, overflowY: 'auto', paddingBottom: 32 }}>
        <Filter />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', maxWidth: '80vw' }}>
        <div style={{ padding: '24px 32px 0 32px', background: '#f7f8fa' }}>
          <SearchBar />
        </div>
        <div id="amazon-product-main-grid" style={{ flex: 1, overflowY: 'auto', padding: '0 32px 32px 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', marginTop: 24 }}>
            {loading ? (
              <div>Loading...</div>
            ) : filteredProducts.length === 0 ? (
              <div>No products found.</div>
            ) : (
              filteredProducts.slice(0, visibleCount).map(product => (
                <ProductCard key={product._id} value={product} />
              ))
            )}
          </div>
          {loadingMore && (
            <div style={{ textAlign: 'center', margin: '24px 0', color: '#888', fontSize: '1.1rem' }}>
              Loading more products...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
