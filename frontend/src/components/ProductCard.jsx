import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CartData } from '../context/cart.contex';

const ProductCard = ({ value }) => {
  const navigate = useNavigate();
  const { addToCart } = CartData();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(value._id);
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
    width: '220px',
    padding: '12px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    backgroundColor: '#fff',
    margin: '15px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
  },
  image: {
    width: '100%',
    height: '180px',
    objectFit: 'contain',
    borderRadius: '6px',
    marginBottom: '10px',
  },
  name: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#0f1111',
    marginBottom: '8px',
    minHeight: '40px',
    lineHeight: '1.3',
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  },
  oldPrice: {
    fontSize: '13px',
    color: '#565959',
    textDecoration: 'line-through',
  },
  discount: {
    fontSize: '13px',
    color: '#007600',
    fontWeight: 'bold',
  },
  newPrice: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#B12704',
    marginBottom: '12px',
  },
  button: {
    padding: '8px',
    backgroundColor: '#FFD814',
    border: '1px solid #FCD200',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
    transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
  }
};



export default ProductCard;
