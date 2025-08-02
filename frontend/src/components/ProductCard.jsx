import { useNavigate } from 'react-router-dom';
import { CartData } from '../context/cart.contex';
import { toast } from 'react-toastify';
import { FaStar } from 'react-icons/fa';
import { UserData } from '../context/user.contex';

const CATEGORY_ICONS = {
  Electronics: '💻',
  Fashion: '👗',
  Books: '📚',
  Home: '🏠',
  Beauty: '💄',
  Sports: '🏅',
  Toys: '🧸',
  Grocery: '🛒',
};

const ProductCard = ({ value }) => {
  const navigate = useNavigate();
  const { addToCart } = CartData();
  const { isAuth } = UserData();

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!isAuth) {
      toast.error('Please login or sign up to add product in cart');
      return;
    }
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



  // Category tags
  const categories = Array.isArray(value.category) ? value.category : value.category ? [value.category] : [];

  return (
    <div
      className="amazon-product-card"
      onClick={handleCardClick}
    >
      <img src={value.image.url} alt={value.name} className="amazon-product-card-img" />
      <h3 className="amazon-product-card-title">{value.name}</h3>
      {categories.length > 0 && (
        <div className="amazon-product-card-categories">
          {categories.map(cat => (
            <span key={cat} className="amazon-product-card-category-chip">
              <span className="amazon-product-card-category-icon">{CATEGORY_ICONS[cat] || '🏷️'}</span> {cat}
            </span>
          ))}
        </div>
      )}

      <div className="amazon-product-card-price-row">
        {value.oldprice && (
          <span className="amazon-old-price">₹{value.oldprice}</span>
        )}
        {getDiscount() && (
          <span className="amazon-discount">{getDiscount()}% off</span>
        )}
      </div>
      <span className="amazon-new-price">₹{value.newprice}</span>
      <button
        className="amazon-product-card-btn"
        onClick={handleAddToCart}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f7ca00')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FFD814')}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
