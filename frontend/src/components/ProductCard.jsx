import { useNavigate } from 'react-router-dom';
import { CartData } from '../context/cart.contex';
import { toast } from 'react-toastify';

const ProductCard = ({ value }) => {
  const navigate = useNavigate();
  const { addToCart } = CartData();

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    const result = await addToCart(value._id);

    if (result.success) {
      toast.success("Product added to cart successfully!");
    } else {
      toast.error("Failed to add product. Please try again.");
    }
  };


  const handleCardClick = () => {
    navigate(`/product/${value._id}`);
  };

  const getDiscount = () => {
    if (!value.oldprice) return null;
    const discount =
      ((value.oldprice - value.newprice) / value.oldprice) * 100;
    return Math.round(discount);
  };

  return (
    <div
      style={styles.card}
      onClick={handleCardClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.03)';
        e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = styles.card.boxShadow;
      }}
    >
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

      <button
        style={styles.button}
        onClick={handleAddToCart}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f7ca00')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFD814')}
      >
        Add to Cart
      </button>
    </div>
  );
};

const styles = {
  card: {
    width: '100%',
    maxWidth: '240px',
    padding: '16px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    backgroundColor: '#fff',
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
    marginBottom: '12px',
  },
  name: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#0f1111',
    marginBottom: '10px',
    minHeight: '40px',
    lineHeight: '1.4',
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
    fontSize: '17px',
    fontWeight: '700',
    color: '#B12704',
    marginBottom: '14px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#FFD814',
    border: '1px solid #FCD200',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
  }
};

export default ProductCard;
