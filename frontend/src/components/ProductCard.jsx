import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ value }) => {
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    console.log(`Added to cart: ${value.name}`);
  };

  const handleCardClick = () => {
    navigate(`/product/${value._id}`);
  };

  // Calculate discount if old price is available
  const getDiscount = () => {
    if (!value.oldprice) return null;
    const discount =
      ((value.oldprice - value.newprice) / value.oldprice) * 100;
    return Math.round(discount);
  };

  return (
    <div style={styles.card} onClick={handleCardClick}>
      <img src={value.image.url} alt={value.name} style={styles.image} />
      <h3 style={styles.name}>{value.name}</h3>

      <div style={styles.priceContainer}>
        {value.oldprice && (
          <>
            <span style={styles.oldPrice}>₹{value.oldprice}</span>
            <span style={styles.discount}>{getDiscount()}% off</span>
          </>
        )}
      </div>

      <span style={styles.newPrice}>₹{value.newprice}</span>

      <button style={styles.button} onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
};

const styles = {
  card: {
    width: '180px',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    margin: '10px',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 'auto',
    transition: 'transform 0.2s ease-in-out',
  },
  image: {
    width: '100%',
    height: '160px',
    objectFit: 'contain',
    borderRadius: '4px',
    marginBottom: '8px',
  },
  name: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#0f1111',
    marginBottom: '6px',
    minHeight: '36px',
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '2px',
  },
  oldPrice: {
    fontSize: '12px',
    color: '#565959',
    textDecoration: 'line-through',
  },
  discount: {
    fontSize: '12px',
    color: '#007600',
    fontWeight: 'bold',
  },
  newPrice: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#B12704',
    marginBottom: '10px',
  },
  button: {
    padding: '6px',
    backgroundColor: '#FFD814',
    border: '1px solid #FCD200',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '12px',
  }
};


export default ProductCard;
