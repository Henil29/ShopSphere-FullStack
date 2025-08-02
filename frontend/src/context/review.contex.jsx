import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from '../config/axios';

const ReviewContext = createContext();

export const useReview = () => useContext(ReviewContext);

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all reviews for a product
  const fetchReviews = useCallback(async (productId) => {
    setLoading(true);
    try {
      const res = await axios.get('/api/review/all');
      // Filter reviews for this product (handle both populated and unpopulated productId)
      const productReviews = res.data.reviews.filter(r => {
        if (typeof r.productId === 'object' && r.productId !== null) {
          return String(r.productId._id) === String(productId);
        } else {
          return String(r.productId) === String(productId);
        }
      });
      setReviews(productReviews);
    } catch (err) {
      setReviews([]);
    }
    setLoading(false);
  }, []);

  // Add a review for a product
  const addReview = async (productId, { message, rating }) => {
    setLoading(true);
    try {
      const res = await axios.post(`/api/review/${productId}`, { message, rating });
      setReviews(prev => [...prev, res.data.review]);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return { success: false, message: err.response?.data?.message || 'Failed to add review' };
    }
  };

  // Update a review
  const updateReview = async (reviewId, { message, rating }) => {
    setLoading(true);
    try {
      await axios.put(`/api/review/${reviewId}`, { message, rating });
      setReviews(prev => prev.map(r => r._id === reviewId ? { ...r, message, rating } : r));
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return { success: false, message: err.response?.data?.message || 'Failed to update review' };
    }
  };

  // Delete a review
  const deleteReview = async (reviewId) => {
    setLoading(true);
    try {
      await axios.delete(`/api/review/${reviewId}`);
      setReviews(prev => prev.filter(r => r._id !== reviewId));
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return { success: false, message: err.response?.data?.message || 'Failed to delete review' };
    }
  };

  return (
    <ReviewContext.Provider value={{ reviews, loading, fetchReviews, addReview, updateReview, deleteReview }}>
      {children}
    </ReviewContext.Provider>
  );
};
