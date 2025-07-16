import React, { useEffect, useState } from 'react';
import { ProductData } from '../context/product.contex.jsx';
import { UserData } from '../context/user.contex.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Product.css';

const SellerProducts = () => {
  const { products, fetchProduct, loading, deleteProduct } = ProductData();
  const { user } = UserData();
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, []);

  if (!user) return <div className="amazon-product-list-container">Please log in.</div>;

  // Filter products by sellerId
  const sellerProducts = products.filter(p => p.sellerId && (p.sellerId._id === user._id || p.sellerId === user._id));

  const handleDelete = async (productId) => {
    setDeletingId(productId);
    const result = await deleteProduct(productId);
    setDeletingId(null);
    if (result.success) {
      toast.success('Product deleted successfully!');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="amazon-product-list-container">
      <div className="amazon-product-list-header">
        <h2>My Products</h2>
        <button className="amazon-add-product-btn" onClick={() => navigate('/seller')}>Add New Product</button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : sellerProducts.length === 0 ? (
        <div>No products found.</div>
      ) : (
        <div className="amazon-product-list-grid">
          {sellerProducts.map(product => (
            <div key={product._id} className="amazon-product-list-card">
              <img src={product.image?.url} alt={product.name} className="amazon-product-list-img" />
              <div className="amazon-product-list-info">
                <h3>{product.name}</h3>
                <p><b>Price:</b> ₹{product.newprice}</p>
                <p><b>Quantity:</b> {product.quantity}</p>
                <p><b>Category:</b> {Array.isArray(product.category) ? product.category.join(', ') : product.category}</p>
                <p><b>Details:</b> {product.details}</p>
                <div className="amazon-product-list-actions">
                  <Link
                    to={`/update-product/${product._id}`}
                    className="amazon-product-list-btn amazon-product-list-btn-update"
                  >
                    Update
                  </Link>
                  <button
                    className="amazon-product-list-btn amazon-product-list-btn-delete"
                    onClick={() => handleDelete(product._id)}
                    disabled={deletingId === product._id}
                  >
                    {deletingId === product._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerProducts;