import React, { useEffect, useState } from 'react';
import { ProductData } from '../context/product.contex.jsx';
import { Loading } from '../components/Loading.jsx';
import { FaStar } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import { CartData } from '../context/cart.contex';
import { toast } from 'react-toastify';


import './Product.css';

const Product = () => {
    const { singleProduct, loading, fetchOneProduct } = ProductData();
    const { addToCart } = CartData();

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
        }
    }, [id]);

    if (loading) return <Loading />;
    if (!singleProduct) return <p>Product not found</p>;

    const rating = 4.4
    const ratingCount = 1950;
    const brand = 'ASUS';
    const model = 'Strix G16';
    const deliveryDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <>
            {/* Back Button at the very top */}
            <button className="amazon-back-btn" onClick={() => navigate(-1)}>
                &#8592; Back
            </button>
            <div className="amazon-product-container">
                {/* Left: Product Image */}
                <div className="amazon-product-image-section">
                    <img src={singleProduct.image.url} alt={singleProduct.name} className="amazon-product-image" />
                    {/* <p className="amazon-image-caption">Click to see full view</p> */}
                </div>

                {/* Right: Product Info */}
                <div className="amazon-product-info-section">
                    {/* Title */}
                    <h1 className="amazon-product-title">{singleProduct.name}</h1>
                    {/* Ratings */}
                    <div className="amazon-product-rating">
                        <span className="amazon-rating-value">{rating} </span>
                        <span className="amazon-stars">
                            {[...Array(5)].map((_, i) => (
                                <FaStar key={i} color={i < Math.round(rating) ? '#FFA41C' : '#ddd'} size={18} />
                            ))}
                        </span>
                        <span className="amazon-rating-count">{ratingCount} ratings</span>
                        <span className="amazon-choice">Amazon's Choice</span>
                    </div>
                    {/* Price */}
                    <div className="amazon-product-price-section">
                        <span className="amazon-new-price">₹{singleProduct.newprice?.toLocaleString()}</span>
                        <span className="amazon-old-price">₹{singleProduct.oldprice?.toLocaleString()}</span>
                    </div>
                    {/* Shipping & Delivery */}
                    <div className="amazon-delivery-info">
                        <span className="amazon-in-stock">In Stock</span>
                        <span className="amazon-delivery">Free delivery by <strong>{deliveryDate}</strong></span>
                        <span className="amazon-shipping">Ships from <b>Amazon.com</b></span>
                    </div>
                    {/* Quantity Selector */}
                    <div className="amazon-quantity-section">
                        <label htmlFor="quantity">Quantity: </label>
                        <select id="quantity" value={quantity} onChange={e => setQuantity(Number(e.target.value))}>
                            {Array.from({ length: Math.min(singleProduct.quantity, 10) }, (_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                    </div>
                    {/* Buttons */}
                    <div className="amazon-buttons-section">
                        <button className="amazon-cart-btn" onClick={() => handleAddToCart(singleProduct._id, quantity)}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f7ca00')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFD814')}
                        >Add to Cart</button>
                        <button className="amazon-buy-btn">Buy Now</button>
                    </div>
                    {/* Product Details */}
                    <div className="amazon-product-details-section">
                        <p className="amazon-product-details">{singleProduct.details}</p>
                    </div>
                    {/* Brand/Model Info */}
                    <div className="amazon-product-meta">
                        <div><b>Brand:</b> {brand}</div>
                        <div><b>Model Name:</b> {model}</div>
                        <div><b>Category:</b> {singleProduct.category?.join(', ')}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Product;
