import tryCatch from '../utils/tryCatch.js';
import { Review } from '../models/review.model.js';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { Product } from '../models/product.model.js';


export const getReviews = tryCatch(async (req, res) => {
    const reviews = await Review.find().populate('userId', 'name email');
    res.status(200).json({
        message: 'Reviews retrieved successfully',
        reviews
    })
})

export const addReview = tryCatch(async (req, res) => {
    const { message, rating } = req.body;

    // to get product id
    const productId = await Product.findById(req.params.id);
    if (!productId) {
        return res.status(404).json({
            message: 'Product not found'
        })
    }

    // to get user id
    const token = req.cookies.token;
    const userId = jwt.verify(token, process.env.JWT_SECRET).id;
    if (!userId) {
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }
    if (!rating) {
        return res.status(400).json({
            message: 'Rating is required'
        });
    }
    if (rating < 1 || rating > 5) {
        return res.status(400).json({
            message: 'Rating must be between 1 and 5'
        });
    }
    const review = await Review.create({
        userId,
        productId,
        message,
        rating
    })

    const populatedReview = await Review.findById(review._id)
        .populate('productId', 'name')
        .populate('userId', 'name email');

    res.status(201).json({
        message: 'Review added successfully',
        review: populatedReview
    });

})

export const deleteReview = tryCatch(async (req, res) => {
    const reviewId = req.params.id;
    const review = await Review.findById(reviewId);
    if (!review) {
        return res.status(404).json({
            message: 'Review not found'
        })
    }
    const token = req.cookies.token;
    const userId = jwt.verify(token, process.env.JWT_SECRET).id;
    const ReviewOwnerId = (review.userId);

    if (userId != ReviewOwnerId) {
        return res.status(403).json({
            message: 'You are not authorized to delete this review'
        })
    }

    await review.deleteOne()
    res.status(200).json({
        message: 'Review deleted successfully'
    })
})

export const updateReview = tryCatch(async (req, res) => {
    const { rating, message } = req.body;

    const reviewId = req.params.id;
    const review = await Review.findById(reviewId);
    if (!review) {
        return res.status(404).json({
            message: 'Review not found'
        })
    }
    const token = req.cookies.token;
    const userId = jwt.verify(token, process.env.JWT_SECRET).id;
    const ReviewOwnerId = (review.userId);

    if (userId != ReviewOwnerId) {
        return res.status(403).json({
            message: 'You are not authorized to delete this review'
        })
    }
    if (rating < 1 || rating > 5) {
        return res.status(400).json({
            message: 'Rating must be between 1 and 5'
        })
    }
    if (rating) review.rating = rating;
    if (message) review.message = message;
    await review.save()
    res.status(200).json({
        message: 'Review updated successfully',
    })

})