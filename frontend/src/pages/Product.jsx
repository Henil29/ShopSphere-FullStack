import React, { useEffect, useState } from 'react';
import { ProductData } from '../context/product.contex.jsx';
import { Loading } from '../components/Loading.jsx';
import { FaStar } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import { CartData } from '../context/cart.contex';
import { toast } from 'react-toastify';
import { useReview } from '../context/review.contex.jsx';
import { UserData } from '../context/user.contex.jsx';


import './Product.css';

const Product = () => {
    const { singleProduct, loading, fetchOneProduct } = ProductData();
    const { addToCart } = CartData();
    const { reviews, loading: reviewLoading, fetchReviews, addReview, deleteReview } = useReview();
    const { isAuth, user } = UserData();
    const [reviewForm, setReviewForm] = useState({ rating: 0, message: '' });
    const [submitting, setSubmitting] = useState(false);

    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();

    async function handleAddToCart(productId, quantity) {
        const result = await addToCart(productId, quantity)
        if (result.success) {
            toast.success("Product added to cart successfully!");
        }
        else {
            toast.error("Failed to add product. Please try again.");
        }
    }
    useEffect(() => {
        if (id) {
            fetchOneProduct(id);
            fetchReviews(id);
        }
    }, [id]);

    if (loading) return <Loading />;
    if (!singleProduct) return <p>Product not found</p>;

    // Calculate dynamic rating and count from reviews
    const ratingCount = reviews.length;
    const rating = ratingCount > 0 ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / ratingCount).toFixed(1) : '—';
    const brand = singleProduct.brand || '';
    const model = singleProduct.model || '';
    const deliveryDate = singleProduct.timeToDeliver ? `Estimated delivery in ${singleProduct.timeToDeliver}` : '';

    return (
        <div style={{ minHeight: '100vh', background: '#f7f8fa', paddingBottom: 40 }}>
            {/* Back Button at the very top */}
            <button className="amazon-back-btn" onClick={() => navigate(-1)} style={{ margin: '24px 0 0 24px', position: 'static' }}>
                &#8592; Back
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                {/* Product Details Section - no outer box */}
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', width: '100%', maxWidth: 1200, minHeight: 'calc(100vh - 120px)', margin: '32px 0 0 0', gap: 48, padding: '0 32px' }}>
                    {/* Left: Product Image */}
                    <div className="amazon-product-image-section" style={{ background: 'none', boxShadow: 'none', padding: 0, minWidth: 320, maxWidth: 420, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={singleProduct.image.url} alt={singleProduct.name} className="amazon-product-image" style={{ maxHeight: 380, width: '100%', objectFit: 'contain', background: '#fff', borderRadius: 12, boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }} />
                    </div>
                    {/* Right: Product Info */}
                    <div className="amazon-product-info-section" style={{ background: 'none', boxShadow: 'none', padding: 0, minWidth: 320, maxWidth: 600, width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <h1 className="amazon-product-title" style={{ fontSize: '2.1rem', marginBottom: 8 }}>{singleProduct.name}</h1>
                        <div className="amazon-product-rating" style={{ marginBottom: 8 }}>
                            <span className="amazon-rating-value">{rating} </span>
                            <span className="amazon-stars">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} color={i < Math.round(rating) ? '#FFA41C' : '#ddd'} size={18} />
                                ))}
                            </span>
                            <span className="amazon-rating-count">{ratingCount} ratings</span>
                            <span className="amazon-choice">Amazon's Choice</span>
                        </div>
                        <div className="amazon-product-price-section" style={{ marginBottom: 8 }}>
                            <span className="amazon-new-price">₹{singleProduct.newprice?.toLocaleString()}</span>
                            <span className="amazon-old-price">₹{singleProduct.oldprice?.toLocaleString()}</span>
                        </div>
                        <div className="amazon-delivery-info" style={{ marginBottom: 8 }}>
                            <span className="amazon-in-stock">In Stock</span>
                            <span className="amazon-delivery">Free delivery by <strong>{deliveryDate}</strong></span>
                            <span className="amazon-shipping">Ships from <b>Amazon.com</b></span>
                        </div>
                        <div className="amazon-quantity-section" style={{ marginBottom: 8 }}>
                            <label htmlFor="quantity">Quantity: </label>
                            <select id="quantity" value={quantity} onChange={e => setQuantity(Number(e.target.value))}>
                                {Array.from({ length: Math.min(singleProduct.quantity, 10) }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                        </div>
                        <div className="amazon-buttons-section" style={{ marginBottom: 10 }}>
                            <button className="amazon-cart-btn" onClick={() => handleAddToCart(singleProduct._id, quantity)}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f7ca00')}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFD814')}
                            >Add to Cart</button>
                            <button className="amazon-buy-btn">Buy Now</button>
                        </div>
                        <div className="amazon-product-details-section" style={{ marginBottom: 8 }}>
                            <p className="amazon-product-details">{singleProduct.details}</p>
                        </div>
                        <div className="amazon-product-meta">
                            <div><b>Brand:</b> {brand}</div>
                            <div><b>Model Name:</b> {model}</div>
                            <div><b>Category:</b> {singleProduct.category?.join(', ')}</div>
                        </div>
                    </div>
                </div>
                {/* Review Section */}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 36 }}>
                  <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: '32px 28px', maxWidth: '1100px', width: '65%' }}>
                    <h2 style={{ fontSize: '1.35rem', marginBottom: 18, textAlign: 'center', fontWeight: 700, letterSpacing: 0.2 }}>Product Reviews</h2>
                    {isAuth ? (
                      <form
                        onSubmit={async e => {
                          e.preventDefault();
                          if (!reviewForm.rating) return toast.error('Please select a rating.');
                          setSubmitting(true);
                          const result = await addReview(id, reviewForm);
                          setSubmitting(false);
                          if (result.success) {
                            setReviewForm({ rating: 0, message: '' });
                            toast.success('Review added!');
                          } else {
                            toast.error(result.message);
                          }
                        }}
                        style={{ background: '#f8f9fa', borderRadius: 12, boxShadow: '0 1px 6px rgba(0,0,0,0.04)', padding: 18, marginBottom: 28, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                          <span style={{ fontWeight: 500 }}>Your Rating:</span>
                          {[1,2,3,4,5].map(star => (
                            <span
                              key={star}
                              style={{ cursor: 'pointer', color: reviewForm.rating >= star ? '#FFA41C' : '#ddd', fontSize: 24 }}
                              onClick={() => setReviewForm(f => ({ ...f, rating: star }))}
                            >★</span>
                          ))}
                        </div>
                        <textarea
                          value={reviewForm.message}
                          onChange={e => setReviewForm(f => ({ ...f, message: e.target.value }))}
                          placeholder="Write your review (optional)"
                          style={{ width: '100%', minHeight: 56, borderRadius: 8, border: '1.2px solid #e0e0e0', padding: 10, fontFamily: 'inherit', fontSize: 16, marginBottom: 12, resize: 'vertical', background: '#fff' }}
                        />
                        <button type="submit" disabled={submitting} style={{ background: '#FFD814', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 600, fontSize: 17, cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                          {submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                      </form>
                    ) : (
                      <div style={{ marginBottom: 18, color: '#888', textAlign: 'center' }}>Sign in to write a review.</div>
                    )}
                    {reviewLoading ? (
                      <div style={{ textAlign: 'center', color: '#888' }}>Loading reviews...</div>
                    ) : reviews.length === 0 ? (
                      <div style={{ color: '#888', textAlign: 'center' }}>No reviews yet.</div>
                    ) : (
                      <div
                        className="amazon-review-grid"
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, 1fr)',
                          gap: 18,
                          marginTop: 8,
                          width: '100%',
                        }}
                      >
                        {reviews.map(r => (
                          <div key={r._id} style={{ background: '#f8f9fa', borderRadius: 10, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', width: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                              {[1,2,3,4,5].map(star => (
                                <span key={star} style={{ color: r.rating >= star ? '#FFA41C' : '#ddd', fontSize: 20 }}>★</span>
                              ))}
                              <span style={{ fontWeight: 500, marginLeft: 8 }}>{r.userId?.name || 'User'}</span>
                              <span style={{ color: '#aaa', fontSize: 13, marginLeft: 8 }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                              {isAuth && user && (r.userId?._id === user._id || r.userId === user._id) && (
                                <button onClick={() => deleteReview(r._id)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#B12704', cursor: 'pointer', fontSize: 15 }}>Delete</button>
                              )}
                            </div>
                            <div style={{ fontSize: 16 }}>{r.message}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
            </div>
        </div>
    );
};

export default Product;
