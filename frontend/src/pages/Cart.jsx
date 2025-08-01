import React, { useState } from 'react';
import { Loading } from "../components/Loading.jsx";
import { CartData } from "../context/cart.contex";
import { UserData } from "../context/user.contex.jsx";
import { OrderData } from "../context/order.contex.jsx";
import { toast } from 'react-toastify';
import axios from 'axios';

const Cart = () => {
  const { carts, loading, deleteCartItem, updateCartItemQuantity, fetchCart } = CartData();
  const { user, fetchUser } = UserData();
  const { createOrder } = OrderData();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({ street: '', city: '', country: '', postalCode: '' });
  const [userAddresses, setUserAddresses] = useState(user?.address || []);

  if (loading) return <Loading />;
  if (!carts || !carts.items) return <p>No items in the cart</p>;

  // Calculate subtotal
  const subtotal = carts.items.reduce((sum, item) => sum + (item.productId.newprice * item.quantity), 0);
  const shipping = 0;
  const total = subtotal + shipping;

  const handleProceedToCheckout = () => {
    setShowAddressModal(true);
  };

  const handleSelectAddress = (idx) => {
    setSelectedAddress(idx);
  };

  const handleAddAddressClick = () => {
    setShowAddAddressModal(true);
    setNewAddress({ street: '', city: '', country: '', postalCode: '' });
  };

  const handleNewAddressChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleSaveNewAddress = async () => {
    try {
      // Persist address to backend
      await axios.post('/api/user/address', newAddress);
      await fetchUser(); // Refresh user data
      setShowAddAddressModal(false);
      setShowAddressModal(true);
      toast.success('Address added!');
    } catch (err) {
      toast.error('Failed to add address');
    }
  };

  const handleConfirmAddress = async () => {
    if (selectedAddress === null || selectedAddress === undefined) return;
    // Prepare order data
    const products = carts.items.map(item => ({ productId: item.productId._id, quantity: item.quantity }));
    const paymentMethod = 'Cash'; // or get from UI if you have options
    const addressNum = Number(selectedAddress);
    // Create order
    const result = await createOrder({ products, paymentMethod, addressNum });
    if (result.success) {
      toast.success('Order placed successfully!');
      // Clear cart (delete all items)
      for (const item of carts.items) {
        await deleteCartItem(item._id);
      }
      await fetchCart();
    } else {
      toast.error(result.message || 'Failed to place order');
    }
    setShowAddressModal(false);
    setSelectedAddress(null);
  };

  return (
    <div className="cart-page-layout">
      {/* Left: Cart Products */}
      <div className="cart-products-column">
        {carts.items.length > 0 ? (
          carts.items.map((item) => (
            <div key={item._id} className="cart-card-horizontal">
              <img
                src={item.productId.image?.url}
                alt={item.productId.name}
                className="cart-card-img-horizontal"
              />
              <div className="cart-card-details">
                <h3 className="cart-title">{item.productId.name}</h3>
                <div className="cart-prices-row">
                  <span className="price-old">₹{item.productId.oldprice}</span>
                  <span className="price-new">₹{item.productId.newprice}</span>
                </div>
                <div className="cart-actions-row-horizontal">
                  <div className="qty-container-horizontal">
                    <button
                      onClick={() => {
                        if (item.quantity === 1) {
                          deleteCartItem(item._id);
                        } else {
                          updateCartItemQuantity(item._id, item.quantity - 1);
                        }
                      }}
                      className="qty-btn-horizontal"
                    >
                      {item.quantity === 1 ? "🗑️" : "−"}
                    </button>
                    <div className="qty-display-horizontal">{item.quantity}</div>
                    <button
                      onClick={() => updateCartItemQuantity(item._id, item.quantity + 1)}
                      className="qty-btn-horizontal"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => deleteCartItem(item._id)}
                    className="delete-btn-horizontal"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No items in the cart</p>
        )}
      </div>
      {/* Right: Sticky Bill Box */}
      <aside className="cart-bill-sidebar">
        <div className="cart-bill-box">
          <h2 className="cart-bill-title">Price Summary</h2>
          <div className="cart-bill-row">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="cart-bill-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
          </div>
          <div className="cart-bill-row cart-bill-total-row">
            <span className="cart-bill-total-label">Total</span>
            <span className="cart-bill-total-value">₹{total}</span>
          </div>
          <button className="cart-bill-checkout-btn" onClick={handleProceedToCheckout}>Proceed to Checkout</button>
        </div>
      </aside>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Select Shipping Address</h3>
            {user?.address?.length > 0 && (
              <div className="address-list">
                {user.address.map((addr, idx) => (
                  <div
                    key={idx}
                    className={`address-item${selectedAddress === idx ? ' selected' : ''}`}
                    onClick={() => handleSelectAddress(idx)}
                  >
                    <div>{addr.street}, {addr.city}, {addr.country} - {addr.postalCode}</div>
                  </div>
                ))}
              </div>
            )}
            <button className="add-address-btn" onClick={handleAddAddressClick}>Add Address</button>
            {(!user?.address || user.address.length === 0) && (
              <div className="no-address">No address found. Please add a new address.</div>
            )}
            <div className="modal-actions">
              <button className="modal-cancel-btn" onClick={() => setShowAddressModal(false)}>Cancel</button>
              {user?.address?.length > 0 && (
                <button className="modal-confirm-btn" onClick={handleConfirmAddress} disabled={selectedAddress === null}>Confirm</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {showAddAddressModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Address</h3>
            <div className="new-address-form">
              <input name="street" placeholder="Street" value={newAddress.street} onChange={handleNewAddressChange} />
              <input name="city" placeholder="City" value={newAddress.city} onChange={handleNewAddressChange} />
              <input name="country" placeholder="Country" value={newAddress.country} onChange={handleNewAddressChange} />
              <input name="postalCode" placeholder="Postal Code" value={newAddress.postalCode} onChange={handleNewAddressChange} type="number" min="100000" max="999999" />
              <button className="save-address-btn" onClick={handleSaveNewAddress}>Save Address</button>
            </div>
            <div className="modal-actions">
              <button className="modal-cancel-btn" onClick={() => setShowAddAddressModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    padding: "2rem",
  },
  card: {
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    padding: "1rem",
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: "200px",
    objectFit: "contain",
    marginBottom: "1rem",
  },
  oldPrice: {
    textDecoration: "line-through",
    color: "#999",
    marginRight: "0.5rem",
  },
  newPrice: {
    color: "#d32f2f",
    fontWeight: "bold",
  },
  actionsRow: {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "1rem",
  gap: "25px",
}
,
  quantityBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  quantityButton: {
    padding: "6px 12px",
    fontSize: "18px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    background: "#f5f5f5",
    cursor: "pointer",
    minWidth: "40px",
  },
  quantityText: {
    fontSize: "16px",
    fontWeight: "bold",
    minWidth: "24px",
    textAlign: "center",
  },
  deleteButton: {
    background: "#ff4d4f",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Cart;
